import { ThemeProvider } from "styled-components";
import { darktheme, LightTheme } from "../../theme";
import { UserContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../database/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../../components/Sidebar/Sidebar";
import { ThemePageContainer, ThemePageTopBar } from "./ThemePageStyles";
import HomepageTopBar from "../../components/HomepageTopBar/HomepageTopBar";
import { RxHamburgerMenu } from "react-icons/rx";

const ThemePage = (props) => {
  const user = useContext(UserContext);
  const allThemesData = props?.allThemesData;
  const [allUsers, setAllUsers] = useState([]);

  const navigate = useNavigate();
  const [openSideBar, setOpenSideBar] = useState(false);

  useEffect(() => {
    console.log("allThemesData", allThemesData);
  }, []);

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

  //Check if there is a user logged in, if not then log them out
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  //Add theme function

  const addTheme = async () => {
    try {
      const docRef = await addDoc(collection(db, "themes"), {
        backgroundImg: "",
        primary: "#F8865C",
        recievedBubbleColor: "#ff787f",
        recievedTextColor: "#FEFBF1",
        sentBubbleColor: "#F8865C",
        sentTextColor: "#FEFBF1",
      });

      console.log("Successfully added theme!");
    } catch (e) {
      console.log("Error adding theme: ", e);
    }
  };
  return (
    <ThemeProvider theme={user?.themeMode === "light" ? LightTheme : darktheme}>
      <ThemePageContainer>
        <Sidebar
          showSidebar={openSideBar}
          username={user?.username}
          userId={user?.userId}
          themeMode={user?.themeMode}
          profilePicture={user?.profilePicture[0]}
          handleCloseSidebar={() => {
            setOpenSideBar(false);
          }}
          handleThemeModeChange={handleThemeModeChange}
        />
        <ThemePageTopBar>
          <RxHamburgerMenu
            style={{ cursor: "pointer" }}
            onClick={() => {
              setOpenSideBar(true);
            }}
          />
          Theme
        </ThemePageTopBar>
        <button
          onClick={() => {
            addTheme();
          }}
        >
          Press to add theme
        </button>
      </ThemePageContainer>
    </ThemeProvider>
  );
};

export default ThemePage;
