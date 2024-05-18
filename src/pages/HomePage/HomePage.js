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
import { doc, updateDoc } from "firebase/firestore";

const HomePage = (props) => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const dummyChatsData = [
    {
      otherPersonId: "12312133213123",
      name: "Tasha",
      message: "woiqhowih iwqdooiqdw hodqhwoihqw ow qoqw",
      time: "16:39",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/eh-messager.appspot.com/o/messages%2Ffile_1713474831324_Screenshot%202024-03-13%20002537.png?alt=media&token=b5c9fcf7-e25b-4f72-bf87-ebfa425abaad",
      messageCount: 5,
      sentMessageStatus: "Read",
    },
    {
      name: "Tasha",
      message: "woiqhowih iwqdooiqdw hodqhwoihqw ow qoqw",
      time: "16:39",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/eh-messager.appspot.com/o/messages%2Ffile_1713474831324_Screenshot%202024-03-13%20002537.png?alt=media&token=b5c9fcf7-e25b-4f72-bf87-ebfa425abaad",
      messageCount: 5,
      sentMessageStatus: "Loading",
    },
    {
      name: "Tasha",
      message:
        "orem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliqu.orem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliqu",
      time: "16:39",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/eh-messager.appspot.com/o/messages%2Ffile_1713474831324_Screenshot%202024-03-13%20002537.png?alt=media&token=b5c9fcf7-e25b-4f72-bf87-ebfa425abaad",
      messageCount: 199,
      sentMessageStatus: "Sent",
    },
  ];
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
          {dummyChatsData.map((chat, index) => {
            return (
              <ChatPreview
                key={index}
                name={chat.name}
                message={chat.message}
                time={chat.time}
                profilePicture={chat.profilePicture}
                messageCount={chat.messageCount}
                sentMessageStatus={chat.sentMessageStatus}
                otherPersonId={chat.otherPersonId}
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
