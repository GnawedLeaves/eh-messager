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
  AddNewThemeButton,
  AddNewThemeContainer,
  ColourWheelContainer,
  ColourWheelHexInput,
  HightLightContainer,
  MessagePreviewContainer,
  MessagePreviewModeContainer,
  MessagePreviewPrimary,
  MessagePreviewPrimaryContainer,
  OwnedThemeButton,
  OwnedThemeButtonsContainer,
  PublicThemeBigContainer,
  PublicThemeContainer,
  PublicThemeContainerTitle,
  PublicThemeCreatorUsername,
  PublicThemeName,
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
  ThemesTopBar,
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
import { IoMoon, IoSunnyOutline, IoTrashOutline } from "react-icons/io5";
import { BiPencil } from "react-icons/bi";
import { getBestTextColor } from "../../functions/getBestTextColor";
import Modal from "../../components/Modal/Modal";

const ThemePage = (props) => {
  const user = useContext(UserContext);
  const [allUsers, setAllUsers] = useState([]);
  const [allThemesData, setAllThemesData] = useState([]);
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });
  const [newThemeName, setNewThemeName] = useState("");
  const [newThemePrimary, setNewThemePrimary] = useState("");
  const navigate = useNavigate();
  const [openSideBar, setOpenSideBar] = useState(false);
  const [hexColor, setHexColor] = useState("");
  const [newRecievedTextBackground, setNewRecievedTextBackground] =
    useState("");
  const [newRecievedTextColor, setNewRecievedTextColor] = useState("");
  const [newSentTextBackground, setNewSentTextBackground] = useState("");
  const [newSentTextColor, setNewSentTextColor] = useState("");
  const [newPrimaryColor, setNewPrimaryColor] = useState("");
  const [editingRecievedColor, setEditingRecievedColor] = useState(false);
  const [editingSentColor, setEditingSentColor] = useState(false);
  const [editingPrimaryColor, setEditingPrimaryColor] = useState(false);
  const [publicThemes, setPublicThemes] = useState();
  const [ownedThemes, setOwnedThemes] = useState();
  const [selectedThemeId, setSelectedThemeId] = useState("");
  const [selectedThemeData, setSelectedThemeData] = useState({});
  const [previewLightMode, setPreviewLightMode] = useState(true);
  const [addingNewTheme, setAddingNewTheme] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingThemeObject, setDeleteingThemeObject] = useState({});
  const [newPrimaryTextColor, setNewPrimaryTextColor] = useState("");

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
    if (user !== null) {
      setSelectedThemeId(user.selectedThemeData.selectedThemeLight.themeId);
      setSelectedThemeData(
        constructSelectedTheme(user.selectedThemeData.selectedThemeLight)
      );
      console.log(
        "selected theme data",
        constructSelectedTheme(user.selectedThemeData.selectedThemeLight)
      );
      user.themeMode === "light"
        ? setPreviewLightMode(true)
        : setPreviewLightMode(false);
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
    const requiredFields = [
      newPrimaryColor,
      newRecievedTextBackground,
      newRecievedTextColor,
      newSentTextBackground,
      newSentTextColor,
      newThemeName,
    ];

    if (requiredFields.every((field) => field !== "")) {
      try {
        const themeData = {
          backgroundImg: "",
          primary: newPrimaryColor,
          recievedBubbleColor: newRecievedTextBackground,
          recievedTextColor: newRecievedTextColor,
          sentBubbleColor: newSentTextBackground,
          sentTextColor: newSentTextColor,
          creatorId: user?.userId,
          dateAdded: timestamp,
          dateEdited: timestamp,
          name: newThemeName,
        };

        const docRef = await addDoc(collection(db, "themes"), themeData);

        console.log("Successfully added theme!", docRef);
        props.getAllThemeData();
        resetAllInputs();
      } catch (e) {
        console.log("Error adding theme: ", e);
      }
    } else {
      console.log("One of the fields is blank");
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
      setDeleteingThemeObject({});
    } catch (e) {
      console.warn("Unable to delete theme: ", e);
    }
  };

  useEffect(() => {
    if (newRecievedTextBackground !== "") {
      setNewRecievedTextColor(getBestTextColor(newRecievedTextBackground));
    }
    if (newSentTextBackground !== "") {
      setNewSentTextColor(getBestTextColor(newSentTextBackground));
    }
    if (newPrimaryColor !== "") {
      setNewPrimaryTextColor(getBestTextColor(newPrimaryColor));
    }
  }, [newRecievedTextBackground, newSentTextBackground, newPrimaryColor]);

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
    setEditingSentColor(false);
    setEditingRecievedColor(true);
    setEditingPrimaryColor(false);
    setHexColor(selectedThemeData.recievedBubbleColor);
    console.log("editing recieved..");
  };

  const handleSentMessageClick = () => {
    setEditingRecievedColor(false);
    setEditingSentColor(true);
    setEditingPrimaryColor(false);
    setHexColor(selectedThemeData.sentBubbleColor);

    console.log("editing sent..");
  };

  const handlePrimaryButtonClicked = () => {
    setEditingRecievedColor(false);
    setEditingSentColor(false);
    setEditingPrimaryColor(true);
    setHexColor(selectedThemeData.primary);
  };

  const getAllPublicThemes = () => {
    const ownedThemes = [];
    const publicThemes = [];
    let selectedTheme = null;

    allThemesData.forEach((theme) => {
      const isOwned = theme.creatorId === user.userId;
      const isSelected = theme.themeId === selectedThemeId;

      if (isSelected) {
        selectedTheme = theme; // Store the selected theme
      } else if (isOwned || theme.name === "Default Theme") {
        ownedThemes.push(theme);
      } else {
        publicThemes.push(theme);
      }
    });

    // Sort themes alphabetically by theme.name
    ownedThemes.sort((a, b) => a.name.localeCompare(b.name));
    publicThemes.sort((a, b) => a.name.localeCompare(b.name));

    // Move the selected theme to the front of the ownedThemes array
    if (selectedTheme) ownedThemes.unshift(selectedTheme);

    setPublicThemes(publicThemes);
    setOwnedThemes(ownedThemes);
  };

  useEffect(() => {
    if (editingRecievedColor) {
      setNewRecievedTextBackground(hexColor);
    } else if (editingSentColor) {
      setNewSentTextBackground(hexColor);
    } else if (editingPrimaryColor) {
      setNewPrimaryColor(hexColor);
    }
  }, [hexColor]);

  const constructSelectedTheme = (theme) => {
    return {
      backgroundImg: theme.backgroundImg,
      creatorId: theme.creatorId,
      creatorUsername: theme.creatorUsername,
      dateAdded: theme.dateAdded,
      dateEdited: theme.dateEdited,
      name: theme.name,
      primary: theme.primary,
      recievedBubbleColor: theme.recievedBubbleColor,
      recievedTextColor: theme.recievedTextColor,
      sentBubbleColor: theme.sentBubbleColor,
      sentTextColor: theme.sentTextColor,
      themeId: theme.themeId,
    };
  };

  const handleOnThemeClick = (theme) => {
    setSelectedThemeId(theme.themeId);
    setSelectedThemeData(theme);
    // changeSelectedTheme(theme);
  };

  const onLeaveAddTheme = () => {
    setEditingPrimaryColor(false);
    setAddingNewTheme(false);
    setEditingRecievedColor(false);
    setEditingSentColor(false);
    setNewPrimaryColor("");
    setNewRecievedTextBackground("");
    setNewRecievedTextColor("");
    setNewSentTextBackground("");
    setNewSentTextColor("");
  };

  return (
    <ThemeProvider
      theme={
        user?.themeMode === "light"
          ? user?.selectedThemeData?.selectedThemeLight || LightTheme
          : user?.selectedThemeData?.selectedThemeDark || darktheme
      }
    >
      <ThemePageContainer>
        <Modal
          handleModalClose={() => {
            setShowDeleteModal(false);
          }}
          modalType="action"
          actionButtonText="Delete"
          actionButtonColor={
            user?.themeMode === "light"
              ? user?.selectedThemeData?.selectedThemeLight.error ||
                LightTheme.error
              : user?.selectedThemeData?.selectedThemeDark.error ||
                darktheme.error
          }
          actionButtonClick={() => {
            setShowDeleteModal(false);
            deleteTheme(deletingThemeObject);
          }}
          show={showDeleteModal}
          modalTitle="Delete Theme"
          modalContent={`Are you sure you want to delete ${deletingThemeObject.name}?`}
          theme={
            user?.themeMode === "light"
              ? user?.selectedThemeData?.selectedThemeLight || LightTheme
              : user?.selectedThemeData?.selectedThemeDark || darktheme
          }
        />
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
        <ThemePreviewContainer
          background={
            previewLightMode ? LightTheme().background : darktheme.background
          }
        >
          <MessagePreviewContainer>
            <MessagePreviewModeContainer>
              {previewLightMode ? (
                <IoMoon
                  style={{ cursor: "pointer" }}
                  size={"24px"}
                  color={darktheme.background}
                  onClick={() => {
                    setPreviewLightMode(!previewLightMode);
                  }}
                />
              ) : (
                <IoSunnyOutline
                  style={{ cursor: "pointer" }}
                  size={"24px"}
                  color={LightTheme().background}
                  onClick={() => {
                    setPreviewLightMode(!previewLightMode);
                  }}
                />
              )}
            </MessagePreviewModeContainer>
            <RecievedMessageContainer>
              Recieved Message
              <RecievedMessageBubble
                themePageBackground={
                  editingRecievedColor || newRecievedTextBackground !== ""
                    ? newRecievedTextBackground
                    : selectedThemeData.recievedBubbleColor
                }
                themePageColor={
                  editingRecievedColor || newRecievedTextColor !== ""
                    ? newRecievedTextColor
                    : selectedThemeData.recievedTextColor
                }
                onClick={() => {
                  handleRecievedMessageClick();
                }}
              >
                hey
              </RecievedMessageBubble>
            </RecievedMessageContainer>
          </MessagePreviewContainer>

          <MessagePreviewContainer>
            <HightLightContainer hightlighted={false}>
              {/* <RecievedMessageContainer>
               
              </RecievedMessageContainer> */}
              <RecievedMessageBubble
                hightlighted={false}
                themePageBackground={
                  editingRecievedColor || newRecievedTextBackground !== ""
                    ? newRecievedTextBackground
                    : selectedThemeData.recievedBubbleColor
                }
                themePageColor={
                  editingRecievedColor || newRecievedTextColor !== ""
                    ? newRecievedTextColor
                    : selectedThemeData.recievedTextColor
                }
                onClick={() => {
                  handleRecievedMessageClick();
                }}
              >
                how are you doing?
              </RecievedMessageBubble>
            </HightLightContainer>
          </MessagePreviewContainer>
          <MessagePreviewContainer>
            <SentMessageContainer>
              Sent Message
              <SentMessageBubble
                themePageBackground={
                  editingSentColor || newSentTextBackground !== ""
                    ? newSentTextBackground
                    : selectedThemeData.sentBubbleColor
                }
                themePageColor={
                  editingSentColor || newSentTextColor !== ""
                    ? newSentTextColor
                    : selectedThemeData.sentTextColor
                }
                onClick={() => {
                  handleSentMessageClick();
                }}
              >
                I'm fine thank you
              </SentMessageBubble>
            </SentMessageContainer>
            <MessagePreviewPrimaryContainer>
              <MessagePreviewPrimary
                background={
                  editingPrimaryColor || newPrimaryColor !== ""
                    ? newPrimaryColor
                    : selectedThemeData.primary
                }
                color={
                  editingPrimaryColor || newPrimaryTextColor !== ""
                    ? newPrimaryTextColor
                    : getBestTextColor(selectedThemeData.primary)
                }
                onClick={() => {
                  handlePrimaryButtonClicked();
                }}
              >
                Primary Colour
              </MessagePreviewPrimary>
            </MessagePreviewPrimaryContainer>
          </MessagePreviewContainer>
        </ThemePreviewContainer>
        {addingNewTheme ? (
          <AddNewThemeContainer>
            <button
              onClick={() => {
                onLeaveAddTheme();
              }}
            >
              Back
            </button>
            Click message to edit
            <h1>Adding new theme</h1>
            {editingRecievedColor || editingPrimaryColor || editingSentColor ? (
              <>
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
              </>
            ) : (
              <></>
            )}
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
          </AddNewThemeContainer>
        ) : (
          <>
            <ThemesTopBar>
              <PublicThemeContainerTitle>My Themes</PublicThemeContainerTitle>
              <AddNewThemeButton
                background={selectedThemeData.primary}
                color={getBestTextColor(selectedThemeData.primary)}
                onClick={() => {
                  setAddingNewTheme(true);
                }}
              >
                New Theme
              </AddNewThemeButton>
            </ThemesTopBar>
            <ThemeCarousellContainer>
              <ThemeCarousellViewingBox>
                <ThemeCarousell>
                  {ownedThemes ? (
                    ownedThemes.map((theme, index) => {
                      return (
                        <PublicThemeBigContainer key={index}>
                          <PublicThemeContainer
                            selected={theme.themeId === selectedThemeId}
                            selectedColor={theme.primary}
                            onClick={() => {
                              handleOnThemeClick(theme);
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
                            <PublicThemeName>
                              {theme.name && theme.name.length > 13
                                ? theme.name.slice(0, 13) + "..."
                                : theme.name || "Untitled"}
                            </PublicThemeName>
                            <PublicThemeCreatorUsername>
                              {theme.creatorUsername &&
                              theme.creatorUsername.length > 15
                                ? theme.creatorUsername.slice(0, 15) + "..."
                                : theme.creatorUsername}
                            </PublicThemeCreatorUsername>
                          </PublicThemeContainer>
                          {theme.name !== "Default Theme" ? (
                            <OwnedThemeButtonsContainer>
                              <OwnedThemeButton
                                selected={theme.themeId === selectedThemeId}
                                selectedColor={theme.primary}
                                onClick={() => {}}
                              >
                                <BiPencil size={"1.2rem"} />
                              </OwnedThemeButton>
                              <OwnedThemeButton
                                selected={theme.themeId === selectedThemeId}
                                selectedColor={theme.primary}
                                onClick={() => {
                                  setDeleteingThemeObject(theme);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <IoTrashOutline size={"1.2rem"} />
                              </OwnedThemeButton>
                            </OwnedThemeButtonsContainer>
                          ) : (
                            <></>
                          )}
                        </PublicThemeBigContainer>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </ThemeCarousell>
              </ThemeCarousellViewingBox>
            </ThemeCarousellContainer>
            <ThemesTopBar>
              <PublicThemeContainerTitle>
                Public Themes
              </PublicThemeContainerTitle>
            </ThemesTopBar>
            <ThemeCarousellContainer>
              <ThemeCarousellViewingBox>
                <ThemeCarousell>
                  {publicThemes ? (
                    publicThemes.map((theme, index) => {
                      return (
                        <PublicThemeContainer
                          key={index}
                          selected={theme.themeId === selectedThemeId}
                          selectedColor={theme.primary}
                          onClick={() => {
                            handleOnThemeClick(theme);
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
                          <PublicThemeName>
                            {theme.name && theme.name.length > 15
                              ? theme.name.slice(0, 15) + "..."
                              : theme.name || "Untitled"}
                          </PublicThemeName>
                          <PublicThemeCreatorUsername>
                            {theme.creatorUsername &&
                            theme.creatorUsername.length > 15
                              ? theme.creatorUsername.slice(0, 15) + "..."
                              : theme.creatorUsername}
                          </PublicThemeCreatorUsername>
                        </PublicThemeContainer>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </ThemeCarousell>
              </ThemeCarousellViewingBox>
            </ThemeCarousellContainer>
          </>
        )}
      </ThemePageContainer>
    </ThemeProvider>
  );
};

export default ThemePage;
