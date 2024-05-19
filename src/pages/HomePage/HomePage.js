import { useNavigate } from "react-router-dom";
import ChatPreview from "../../components/ChatPreview/ChatPreview";
import { ChatPreviewsContainer, HomePageContainer } from "./HomePageStyles";
import { ThemeProvider } from "styled-components";
import { darktheme, lightTheme } from "../../theme";
import HomepageTopBar from "../../components/HomepageTopBar/HomepageTopBar";
import { useContext, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useEffect } from "react";
import { UserContext } from "../../App";
import { db } from "../../database/firebase";
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { sortByFirebaseTimestamp } from "../../functions/sortArray";
import { handleFirebaseDate } from "../../database/handleFirebaseDate";

const HomePage = (props) => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [openSideBar, setOpenSideBar] = useState(false);

  //Backend

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
    console.log("allUsers", allUsers);
    setAllUsers(allUsers);
  };

  const combineMessages = () => {
    const mapA = new Map(
      allRecievedMessages.map((item) => [item.message_id, item])
    );

    // Merge arrayA into arrayB based on the matching message_id and id
    const mergedArray = allMessages.map((itemB) => {
      const matchingItemA = mapA.get(itemB.id);

      if (matchingItemA) {
        return { ...itemB, ...matchingItemA }; // Combine the objects
      }
      return itemB; // If no match is found, keep the original item from arrayB
    });

    setAllCombinedMessages(mergedArray);
    getUniqueConversations(user?.userId);
  };

  const getUniqueConversations = (userId) => {
    const filteredSenderIDs = allCombinedMessages
      .filter((message) => message.recipient_id === userId)
      .map((message) => message.creator_id);
    const uniqueConversationsArray = [...new Set(filteredSenderIDs)];

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

      let firstMessage = sortedArray[0];

      //If more than 24h, put the date, else put the date
      const handledDate = handleFirebaseDate(firstMessage.date_created);
      let dateStringFinal = "";
      if (checkDateMoreThan24Hours(firstMessage.date_created)) {
        if (checkDateMoreThan1Week(firstMessage.date_created)) {
          // Split the string by spaces
          const parts = handledDate.split(" ");

          // Extract the desired parts and join them back into a string
          const dayAndMonth = parts.slice(1, 3).join(" ");
          dateStringFinal = dayAndMonth;
        }
        dateStringFinal = handledDate.slice(3);
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
          otherUserProfilePicture: otherUserData[0].profilePicture,
          otherUserUsername: otherUserData[0].username,
        };
      } else if (firstMessage.recipient_id === user?.userId) {
        messagePreview = {
          ...firstMessage,
          tempMessageType: "recieved",
          otherUserId: otherUserData[0].userId,
          otherUserProfilePicture: otherUserData[0].profilePicture,
          otherUserUsername: otherUserData[0].username,
        };
      }
      messagePreviewsArray = [...messagePreviewsArray, messagePreview];
    });
    console.log("messagePreviewsArray", messagePreviewsArray);
    setMessagePreviews(messagePreviewsArray);
  };

  const checkDateMoreThan24Hours = (date) => {
    // Convert Firebase timestamp to JavaScript Date object
    const dateFromTimestamp = date.toDate();

    // Get the current date and time
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const differenceInMillis = currentDate - dateFromTimestamp;

    // Calculate the number of milliseconds in 24 hours
    const millisecondsIn24Hours = 24 * 60 * 60 * 1000;

    // Check if the difference is greater than 24 hours
    const isMoreThan24Hours = differenceInMillis > millisecondsIn24Hours;

    return isMoreThan24Hours;
  };

  const checkDateMoreThan1Week = (date) => {
    // Convert Firebase timestamp to JavaScript Date object
    const dateFromTimestamp = date.toDate();

    // Get the current date and time
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const differenceInMillis = currentDate - dateFromTimestamp;

    // Calculate the number of milliseconds in 1 week (7 days)
    const millisecondsInAWeek = 7 * 24 * 60 * 60 * 1000;

    // Check if the difference is greater than 1 week
    const isMoreThanAWeek = differenceInMillis > millisecondsInAWeek;

    return isMoreThanAWeek;
  };

  useEffect(() => {
    getAllRecievedMessages();
    getAllMessages();
    getAllUsers();
  }, []);

  useEffect(() => {
    combineMessages();
    getUniqueConversations(user?.userId);
  }, [allRecievedMessages, allMessages]);

  useEffect(() => {
    getUniqueConversations(user?.userId);
  }, [allCombinedMessages]);

  return (
    <ThemeProvider theme={user?.themeMode === "light" ? lightTheme : darktheme}>
      <HomePageContainer>
        <Sidebar
          showSidebar={openSideBar}
          username={user?.username}
          themeMode={user?.themeMode}
          profilePicture={user?.profilePicture}
          handleCloseSidebar={() => {
            setOpenSideBar(false);
          }}
          handleThemeModeChange={handleThemeModeChange}
        />
        <HomepageTopBar
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
                messageCount={chat.messageCount}
                sentMessageStatus={chat.is_read}
                otherPersonId={chat.otherUserId}
                themeMode={user?.themeMode}
              />
            );
          })}
        </ChatPreviewsContainer>
      </HomePageContainer>
    </ThemeProvider>
  );
};

export default HomePage;
