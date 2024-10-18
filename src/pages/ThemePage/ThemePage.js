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
  ColourWheelHexInput,
  MessagePreviewContainer,
  PublicThemeContainer,
  PublicThemeContainerTitle,
  PublicThemePreviewContainer,
  PublicThemePreviewRecieved,
  PublicThemePreviewSent,
  PublicThemePreviewText,
  PublicThemesContainer,
  ThemeCarousell,
  ThemeCarousellContainer,
  ThemeCarousellViewingBox,
  ThemePageContainer,
  ThemePageRecentColoursContainer,
  ThemePageTopBar,
  ThemePreviewContainer,
} from "./ThemePageStyles";
import HomepageTopBar from "../../components/HomepageTopBar/HomepageTopBar";
import { RxHamburgerMenu } from "react-icons/rx";
import Wheel from "@uiw/react-color-wheel";
import { HexColorPicker } from "react-colorful";
import { hsvaToHex } from "@uiw/color-convert";
import {
  SentMessageBubble,
  SentMessageContainer,
} from "../../components/SentMessage/SentMessageStyles";
import {
  RecievedMessageBubble,
  RecievedMessageContainer,
} from "../../components/RecievedMessage/RecievedMessageStyles";
import { dummyThemeData } from "./array";

const ThemePage = (props) => {
  const user = useContext(UserContext);
  const [allUsers, setAllUsers] = useState([]);
  const [allThemesData, setAllThemesData] = useState([]);
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });
  const [newThemeName, setNewThemeName] = useState("");
  const [newThemePrimary, setNewThemePrimary] = useState("");
  const navigate = useNavigate();
  const [openSideBar, setOpenSideBar] = useState(false);
  const [hexColor, setHexColor] = useState("#aabbcc");
  const [newRecievedTextBackground, setNewRecievedTextBackground] =
    useState("");
  const [newRecievedTextColor, setNewRecievedTextColor] = useState("");
  const [newSentTextBackground, setNewSentTextBackground] = useState("");
  const [newSentTextColor, setNewSentTextColor] = useState("");
  const [newPrimaryColor, setNewPrimaryColor] = useState("");
  const [editingRecievedColor, setEditingRecievedColor] = useState("");
  const [editingSentColor, setEditingSentColor] = useState("");
  const [publicThemes, setPublicThemes] = useState();
  const [ownedThemes, setOwnedThemes] = useState();
  const [selectedThemeId, setSelectedThemeId] = useState("");

  useEffect(() => {
    if (allThemesData !== null) {
      setAllThemesData(props?.allThemesData);
    }
    //clean up function, will run when props changes
    return () => {
      console.log("Cleanup: Clearing themes data");
      setAllThemesData(null);
    };
  }, [props]);

  useEffect(() => {
    if (user?.selectedThemeData?.selectedThemeLight.themeId !== null) {
      setSelectedThemeId(user.selectedThemeData.selectedThemeLight.themeId);
    }
  }, [user]);

  //todo: remove this
  useEffect(() => {
    console.log("allThemesData", allThemesData);
    getAllPublicThemes();
  }, [allThemesData]);

  //Check if there is a user logged in, if not then log them out
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const addTheme = async () => {
    const timestamp = Timestamp.fromDate(new Date());
    try {
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

  const getLuminance = (hexColor) => {
    // Convert hex color to RGB
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);

    // Normalize RGB values to [0, 1]
    r = r / 255;
    g = g / 255;
    b = b / 255;

    // Apply gamma correction (sRGB luminance)
    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    // Calculate luminance
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const getBestTextColor = (hexColor) => {
    const luminance = getLuminance(hexColor);
    return luminance > 0.5 ? "#333333" : "#FEFBF1"; // Black for light bg, White for dark bg
  };

  useEffect(() => {
    setNewRecievedTextColor(getBestTextColor(newRecievedTextBackground));
    setNewSentTextColor(getBestTextColor(newSentTextBackground));
  }, [newRecievedTextBackground, newSentTextBackground]);

  const addDefaultTheme = async () => {
    const timestamp = Timestamp.fromDate(new Date());
    try {
      await setDoc(doc(db, "themes", "defaultTheme"), {
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
      console.log("default theme added");
    } catch (e) {
      console.log("Unable to add default theme: ", e);
    }
  };

  const handleRecievedMessageClick = () => {
    setEditingRecievedColor(true);
    console.log("editing recieved..");
  };

  const handleSentMessageClick = () => {
    setEditingSentColor(true);
    console.log("editing sent..");
  };

  const getAllPublicThemes = () => {
    const ownedThemes = allThemesData.filter((theme) => {
      return theme.creatorId === user.userId;
    });
    const publicThemes = allThemesData.filter((theme) => {
      return theme.creatorId !== user.userId;
    });
    setPublicThemes(publicThemes);
    setOwnedThemes(ownedThemes);
  };
  const getAllOwnedThemes = () => {};

  //todo: remove this
  useEffect(() => {
    setNewRecievedTextBackground(hexColor);
  }, [hexColor]);

  return (
    <ThemeProvider
      theme={
        user?.themeMode === "light"
          ? user?.selectedThemeData?.selectedThemeLight || LightTheme
          : user?.selectedThemeData?.selectedThemeDark || darktheme
      }
    >
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
        <ThemePreviewContainer>
          <MessagePreviewContainer>
            <RecievedMessageContainer
              onClick={() => {
                handleRecievedMessageClick();
              }}
            >
              <RecievedMessageBubble themePageBackground={"red"}>
                recieved message
              </RecievedMessageBubble>
            </RecievedMessageContainer>
          </MessagePreviewContainer>
          <MessagePreviewContainer>
            <RecievedMessageContainer
              onClick={() => {
                handleRecievedMessageClick();
              }}
            >
              <RecievedMessageBubble themePageBackground={"red"}>
                recieved message
              </RecievedMessageBubble>
            </RecievedMessageContainer>
          </MessagePreviewContainer>
          <MessagePreviewContainer>
            <SentMessageContainer
              onClick={() => {
                handleSentMessageClick();
              }}
            >
              <SentMessageBubble themePageBackground={"green"}>
                sent message salmon
              </SentMessageBubble>
            </SentMessageContainer>
          </MessagePreviewContainer>
        </ThemePreviewContainer>
        <PublicThemeContainerTitle>Public Themes</PublicThemeContainerTitle>
        <ThemeCarousellContainer>
          <ThemeCarousellViewingBox>
            <ThemeCarousell>
              {dummyThemeData ? (
                dummyThemeData.map((theme, index) => {
                  return (
                    <PublicThemeContainer
                      key={index}
                      selected={theme.themeId === selectedThemeId}
                      onClick={() => {
                        setSelectedThemeId(theme.themeId);
                      }}
                    >
                      <PublicThemePreviewContainer>
                        <PublicThemePreviewRecieved
                          background={theme.recievedBubbleColor}
                        >
                          <PublicThemePreviewText
                            background={theme.recievedTextColor}
                          />
                        </PublicThemePreviewRecieved>
                        <PublicThemePreviewSent
                          background={theme.sentBubbleColor}
                        >
                          <PublicThemePreviewText
                            background={theme.sentTextColor}
                          />
                        </PublicThemePreviewSent>
                      </PublicThemePreviewContainer>
                      {theme.name ? theme.name : "Untitled"}
                    </PublicThemeContainer>
                  );
                })
              ) : (
                <></>
              )}
            </ThemeCarousell>
          </ThemeCarousellViewingBox>
        </ThemeCarousellContainer>
        <PublicThemesContainer>
          {ownedThemes ? (
            ownedThemes.map((theme, index) => {
              return (
                <PublicThemeContainer key={index}>
                  {theme.name ? theme.name : "Untitled"}
                </PublicThemeContainer>
              );
            })
          ) : (
            <></>
          )}
        </PublicThemesContainer>
        Click to edit colour
        <ColourWheelContainer>
          <HexColorPicker color={hexColor} onChange={setHexColor} />
          <ColourWheelHexInput
            maxLength={7}
            onChange={(e) => {
              let value = e.target.value;
              if (!value.startsWith("#")) {
                value = `#${value}`;
              }
              setHexColor(value);
            }}
            value={hexColor}
            placeholder="Colour Hex Code"
          />
        </ColourWheelContainer>
        <ThemePageRecentColoursContainer></ThemePageRecentColoursContainer>
        <button
          onClick={() => {
            addDefaultTheme();
          }}
        >
          Add default theme
        </button>
        <div>Selected Theme: {user?.selectedTheme}</div>
        <div
          style={{
            width: "100%",
            height: 34,
            marginTop: 20,
            background: hexColor,
            color: newRecievedTextColor,
          }}
        >
          Text in the div
        </div>
        <p style={{ marginTop: 10 }}>Hex Color: {hexColor}</p>
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
      </ThemePageContainer>
    </ThemeProvider>
  );
};

export default ThemePage;
