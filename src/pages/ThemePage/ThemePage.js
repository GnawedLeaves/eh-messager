import { ThemeProvider } from "styled-components";
import { darktheme, LightTheme } from "../../theme";
import { UserContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../database/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../../components/Sidebar/Sidebar";
import {
  ColourWheelContainer,
  PublicThemesContainer,
  ThemePageContainer,
  ThemePageTopBar,
} from "./ThemePageStyles";
import HomepageTopBar from "../../components/HomepageTopBar/HomepageTopBar";
import { RxHamburgerMenu } from "react-icons/rx";
import Wheel from "@uiw/react-color-wheel";
import { hsvaToHex } from "@uiw/color-convert";

const ThemePage = (props) => {
  const user = useContext(UserContext);
  const [allUsers, setAllUsers] = useState([]);
  const [allThemesData, setAllThemesData] = useState([]);
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });
  const hexColor = hsvaToHex(hsva);
  const [newThemeName, setNewThemeName] = useState("");
  const [newThemePrimary, setNewThemePrimary] = useState("");
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

  useEffect(() => {
    console.log();
  }, []);

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
        primary: hexColor,
        recievedBubbleColor: "#ff787f",
        recievedTextColor: "#FEFBF1",
        sentBubbleColor: "#F8865C",
        sentTextColor: "#FEFBF1",
        creatorId: user?.userId,
        dateAdded: timestamp,
        dateEdited: timestamp,
        name: newThemeName,
      });

      console.log("Successfully added theme!");
      props.getAllThemeData();
      resetAllInputs();
    } catch (e) {
      console.log("Error adding theme: ", e);
    }
  };

  const resetAllInputs = () => {
    setNewThemeName("");
    setHsva({ h: 214, s: 43, v: 90, a: 1 });
  };

  const changeSelectedTheme = async (theme) => {
    console.log("changing theme to ", theme.themeId);
    const userRef = doc(db, "users", user?.userId);
    try {
      await updateDoc(userRef, {
        selectedTheme: theme.themeId,
      });
      props.getUserData(user?.authId);
      console.log("theme has been changed to: ", theme.themeId);
    } catch (e) {
      console.warn("Could not change theme: ", e);
    }
  };

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

  const deleteTheme = async (theme) => {
    console.log("Deleting", theme.themeId);
    try {
      await deleteDoc(doc(db, "themes", theme.themeId));
      console.log("theme successfully deleted");
      props.getAllThemeData();
    } catch (e) {
      console.warn("Unable to delete theme: ", e);
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

        <div>Selected Theme: {user?.selectedTheme}</div>

        <ColourWheelContainer>
          <Wheel
            color={hsva}
            onChange={(color) => setHsva({ ...hsva, ...color.hsva })}
            style={{zIndex: "1"}}
          />
          <div
            style={{
              width: "100%",
              height: 34,
              marginTop: 20,
              background: hexColor,
            }}
          ></div>
          <p style={{ marginTop: 10 }}>Hex Color: {hexColor}</p>
        </ColourWheelContainer>

        <div>New Theme Name</div>
        <input
          value={newThemeName}
          type="text"
          onChange={(e) => {
            setNewThemeName(e.target.value);
          }}
        />
        <button
          onClick={() => {
            addTheme();
          }}
        >
          Press to add theme
        </button>

        <div>
          {allThemesData.map((theme) => {
            return (
              <div style={{ color: "white" }}>
                {theme.themeId}
                <br />
                {theme.name}
                <br />
                {theme.primary}
                <br />
                {theme.dateAdded}
                <br />
                <button
                  style={{ background: theme.primary }}
                  onClick={() => {
                    changeSelectedTheme(theme);
                  }}
                >
                  Change to this theme
                </button>
                <button
                  onClick={() => {
                    deleteTheme(theme);
                  }}
                >
                  Delete this theme
                </button>
                <br /> <br />
              </div>
            );
          })}
        </div>

        <PublicThemesContainer></PublicThemesContainer>
      </ThemePageContainer>
    </ThemeProvider>
  );
};

export default ThemePage;
