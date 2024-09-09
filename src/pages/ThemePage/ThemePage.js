import { ThemeProvider } from "styled-components";
import { darktheme, LightTheme } from "../../theme";
import { UserContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../database/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../../components/Sidebar/Sidebar";
import {
  PublicThemesContainer,
  ThemePageContainer,
  ThemePageTopBar,
} from "./ThemePageStyles";
import HomepageTopBar from "../../components/HomepageTopBar/HomepageTopBar";
import { RxHamburgerMenu } from "react-icons/rx";

const ThemePage = (props) => {
  const user = useContext(UserContext);
  const [allUsers, setAllUsers] = useState([]);
  const [allThemesData, setAllThemesData] = useState([]);

  const navigate = useNavigate();
  const [openSideBar, setOpenSideBar] = useState(false);

  useEffect(() => {
    if (allThemesData !== null) {
      setAllThemesData(props?.allThemesData);
    }
  }, [props]);

  //todo: remove this
  useEffect(() => {
    console.log("allThemesData", allThemesData);
  }, [allThemesData]);

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

  useEffect(()=>{
    console.log()
  },[])

  //Check if there is a user logged in, if not then log them out
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  //Add theme function

  const addTheme = async () => {
    const timestamp = Timestamp.fromDate(new Date());
    try {
      // await setDoc(doc(db, "themes", "defaultTheme"), {
      //   backgroundImg: "",
      //   primary: "#F8865C",
      //   recievedBubbleColor: "#ff787f",
      //   recievedTextColor: "#FEFBF1",
      //   sentBubbleColor: "#F8865C",
      //   sentTextColor: "#FEFBF1",
      //   creatorId: user?.userId,
      //   dateAdded: timestamp,
      //   dateEdited: timestamp,
      // });
      const docRef = await addDoc(collection(db, "themes"), {
        backgroundImg: "",
        primary: "#F8865C",
        recievedBubbleColor: "#ff787f",
        recievedTextColor: "#FEFBF1",
        sentBubbleColor: "#F8865C",
        sentTextColor: "#FEFBF1",
        creatorId: user?.userId,
        dateAdded: timestamp,
        dateEdited: timestamp,
      });

      console.log("Successfully added theme!");
      props.getAllThemeData();
    } catch (e) {
      console.log("Error adding theme: ", e);
    }
  };

  //Convert and clean data

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
        <PublicThemesContainer></PublicThemesContainer>
      </ThemePageContainer>
    </ThemeProvider>
  );
};

export default ThemePage;
