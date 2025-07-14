import { useNavigate } from "react-router-dom";
import ChatPreview from "../../components/ChatPreview/ChatPreview";
import { ChatPreviewsContainer, HomePageContainer } from "./HomePageStyles";
import { ThemeProvider } from "styled-components";
import { darktheme, LightTheme } from "../../theme";
import HomepageTopBar from "../../components/HomepageTopBar/HomepageTopBar";
import { useContext, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useEffect } from "react";
import { UserContext } from "../../App";
import { auth, db } from "../../database/firebase";
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { sortByFirebaseTimestamp } from "../../functions/sortArray";
import { handleFirebaseDate } from "../../database/handleFirebaseDate";
import { onAuthStateChanged } from "firebase/auth";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";

const HomePage = (props) => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [openSideBar, setOpenSideBar] = useState(false);

  const handleThemeModeChange = async (newThemeMode) => {
    if (user?.userId) {
      const userRef = doc(db, "users", user?.userId);
      try {
        await updateDoc(userRef, {
          themeMode: newThemeMode,
        });
        props.getUserData(user?.authId);
      } catch (e) {
        console.log("Error updating user theme mode: ", e);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Creating Message Previews
  //1. Get all messages recieved by user
  //2. Extract out all unique IDs of senders
  //3. get out the full convo then extract out

  const [allRecievedMessages, setAllRecievedMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [allCombinedMessages, setAllCombinedMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [uniqueConversationsIds, setUniqueConversationsIds] = useState();
  const [messagePreviews, setMessagePreviews] = useState([]);

  const getAllRecievedMessages = async () => {
    let allRecievedMessages = [];
    const querySnapshot = await getDocs(collection(db, "message_recipient"));
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      allRecievedMessages = [
        ...allRecievedMessages,
        { id: doc.id, ...docData },
      ];
    });
    setAllRecievedMessages(allRecievedMessages);
  };

  const getAllMessages = async () => {
    let allMessages = [];
    const querySnapshot = await getDocs(collection(db, "message"));
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      allMessages = [...allMessages, { id: doc.id, ...docData }];
    });

    setAllMessages(allMessages);
  };

  const getAllUsers = async () => {
    let allUsers = [];
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      allUsers = [...allUsers, { userId: doc.id, ...docData }];
    });
    setAllUsers(allUsers);
  };

  const combineMessages = () => {
    const mapA = new Map(
      allRecievedMessages.map((item) => [item.message_id, item])
    );

    const mergedArray = allMessages.map((itemB) => {
      const matchingItemA = mapA.get(itemB.id);

      if (matchingItemA) {
        return { ...itemB, ...matchingItemA };
      }
      return itemB;
    });

    setAllCombinedMessages(mergedArray);

    getUniqueConversations(user?.userId);
  };

  const getUniqueConversations = (userId) => {
    //Ids of people who send messages to me
    const filteredRecievedIds = allCombinedMessages
      .filter((message) => message.recipient_id === userId)
      .map((message) => message.creator_id);
    const filteredCleanedRecievedIds = [...new Set(filteredRecievedIds)];

    //Ids of people i sent messages to
    let sendIds = [];
    allCombinedMessages
      .filter((message) => message.creator_id === userId)
      .map((message) => {
        sendIds = [...sendIds, message.recipient_id];
      });

    const filteredSentIds = [...new Set(sendIds)];

    const tempUniqueArray = [...filteredSentIds, ...filteredCleanedRecievedIds];
    const uniqueConversationsArray = [...new Set(tempUniqueArray)];

    setUniqueConversationsIds(uniqueConversationsArray);
    constructMessagesPreviews(uniqueConversationsArray);
  };

  const constructMessagesPreviews = (uniqueConversationsArray) => {
    let messagePreviewsArray = [];
    uniqueConversationsArray.map((uniqueId) => {
      let recievedMessages = allCombinedMessages.filter(
        (message) =>
          message.creator_id === uniqueId &&
          message.recipient_id === user?.userId
      );

      let sentMessages = allCombinedMessages.filter(
        (message) =>
          message.creator_id === user?.userId &&
          message.recipient_id === uniqueId
      );

      let recievedAndSentMessages = [...recievedMessages, ...sentMessages];

      const sortedArray = sortByFirebaseTimestamp(
        recievedAndSentMessages,
        "date_created"
      ).reverse();

      const unreadMessages = recievedMessages.filter(
        (message) => message.is_read === false
      );

      let unreadMessageCount = unreadMessages.length;

      let firstMessage = sortedArray[0];

      const handledDate = handleFirebaseDate(firstMessage.date_created);
      let dateStringFinal = "";
      if (checkDateMoreThan24Hours(firstMessage.date_created)) {
        if (checkDateMoreThan1Week(firstMessage.date_created)) {
          const parts = handledDate.split(" ");

          const dayAndMonth = parts.slice(1, 3).join(" ");
          dateStringFinal = dayAndMonth;
        }
        dateStringFinal = handledDate.substring(4, 11);
      } else {
        dateStringFinal = handledDate.slice(-5);
      }

      firstMessage = {
        converted_date_created: dateStringFinal,
        ...firstMessage,
      };
      let messagePreview = {};
      //get other user data
      let otherUserData = allUsers.filter((user) => user.userId === uniqueId);

      //sort if sent or recieved
      if (firstMessage.creator_id === user?.userId) {
        messagePreview = {
          ...firstMessage,
          tempMessageType: "sent",
          otherUserId: otherUserData[0].userId,
          otherUserProfilePicture: otherUserData[0].profilePicture[0],
          otherUserUsername: otherUserData[0].username,
          unreadMessageCount: unreadMessageCount,
        };
      } else if (firstMessage.recipient_id === user?.userId) {
        messagePreview = {
          ...firstMessage,
          tempMessageType: "recieved",
          otherUserId: otherUserData[0].userId,
          otherUserProfilePicture: otherUserData[0].profilePicture[0],
          otherUserUsername: otherUserData[0].username,
          unreadMessageCount: unreadMessageCount,
        };
      }
      messagePreviewsArray = [...messagePreviewsArray, messagePreview];
    });

    const sortedMessagePreviewsArray = messagePreviewsArray.sort((a, b) => {
      return (
        b.date_created.seconds - a.date_created.seconds ||
        b.date_created.nanoseconds - a.date_created.nanoseconds
      );
    });

    setMessagePreviews(sortedMessagePreviewsArray);
  };

  const checkDateMoreThan24Hours = (date) => {
    const dateFromTimestamp = date.toDate();

    const currentDate = new Date();

    const differenceInMillis = currentDate - dateFromTimestamp;

    const millisecondsIn24Hours = 24 * 60 * 60 * 1000;

    const isMoreThan24Hours = differenceInMillis > millisecondsIn24Hours;

    return isMoreThan24Hours;
  };

  const checkDateMoreThan1Week = (date) => {
    const dateFromTimestamp = date.toDate();

    const currentDate = new Date();

    const differenceInMillis = currentDate - dateFromTimestamp;

    const millisecondsInAWeek = 7 * 24 * 60 * 60 * 1000;

    const isMoreThanAWeek = differenceInMillis > millisecondsInAWeek;

    return isMoreThanAWeek;
  };

  useEffect(() => {
    if (user !== null) {
      getAllRecievedMessages();
      getAllMessages();
      getAllUsers();
    }
  }, [user]);

  useEffect(() => {
    combineMessages();
    getUniqueConversations(user?.userId);
  }, [allRecievedMessages, allMessages]);

  useEffect(() => {
    getUniqueConversations(user?.userId);
  }, [allCombinedMessages]);

  return (
    <ThemeProvider
      theme={
        user?.themeMode === "light"
          ? user?.selectedThemeData?.selectedThemeLight || LightTheme
          : user?.selectedThemeData?.selectedThemeDark || darktheme
      }
    >
      {allUsers.length > 0 && user !== null ? (
        <></>
      ) : (
        <LoadingScreen
          theme={
            user?.themeMode === "light"
              ? user?.selectedThemeData?.selectedThemeLight || LightTheme
              : user?.selectedThemeData?.selectedThemeDark || darktheme
          }
          text="Loading Chats"
        />
      )}

      <HomePageContainer>
        <Sidebar
          showSidebar={openSideBar}
          username={user?.username}
          userId={user?.userId}
          themeMode={user?.themeMode}
          theme={user?.selectedThemeData}
          profilePicture={user?.profilePicture[0]}
          handleCloseSidebar={() => {
            setOpenSideBar(false);
          }}
          handleThemeModeChange={handleThemeModeChange}
        />
        <HomepageTopBar
          allUsers={allUsers}
          handleOpenSidebar={() => {
            setOpenSideBar(true);
          }}
          themeMode={user?.themeMode}
        />
        <ChatPreviewsContainer>
          {messagePreviews.map((chat, index) => {
            return (
              <ChatPreview
                key={index}
                name={chat.otherUserUsername}
                message={chat.message_body}
                time={chat.converted_date_created}
                profilePicture={
                  chat.otherUserProfilePicture
                    ? chat.otherUserProfilePicture
                    : "https://firebasestorage.googleapis.com/v0/b/eh-messager.appspot.com/o/profilePictures%2Fphoto_2024-05-19%2015.40.14.jpeg?alt=media&token=13e40b41-8311-4f84-a881-8a70436b2318"
                }
                unreadMessageCount={chat.unreadMessageCount}
                isRead={chat.is_read}
                otherPersonId={chat.otherUserId}
                themeMode={user?.themeMode}
                tempMessageType={chat.tempMessageType}
              />
            );
          })}
        </ChatPreviewsContainer>
      </HomePageContainer>
    </ThemeProvider>
  );
};

export default HomePage;
