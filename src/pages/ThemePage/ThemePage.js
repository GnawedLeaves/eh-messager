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
  AddThemeButton,
  AddThemeButtonBar,
  AddThemeDetailsSubtitle,
  AddThemeInput,
  AddThemeInputContainer,
  AddThemeSubtitle,
  AddThemeTitle,
  AddThemeTopBar,
  ChatPreviewTitle,
  ColourWheelContainer,
  ColourWheelHexInput,
  HighLightContainerSent,
  HightLightContainer,
  HightLightContainerPrimary,
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
  ThemePreviewBigContainer,
  ThemePreviewContainer,
  ThemesTopBar,
  ThemeTopBarAndCarousellContainer,
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
import {
  ProfilePageDetailsSubtitle,
  ProfilePageDetailsSubtitleAndTitleGroup,
} from "../ProfilePage/ProfilePageStyles";
import Button from "../../components/Button/Button";

const ThemePage = (props) => {
  const user = useContext(UserContext);
  const [allUsers, setAllUsers] = useState([]);
  const [allThemesData, setAllThemesData] = useState([]);
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });
  const [newThemeName, setNewThemeName] = useState("New Theme");
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

  const [clickCreateThemeModalMessage, setClickCreateThemeModalMessage] =
    useState("Someting went wrong. Please try again.  ");
  const [clickCreateThemeModalTitle, setClickCreateThemeModalTitle] =
    useState("Cannot Add Theme");
  const [createThemeModalShow, setCreateThemeModalShow] = useState(false);
  const [addThemeSuccess, setAddThemeSuccess] = useState(false);

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
      { fieldName: "Primary Color", value: newPrimaryColor },
      {
        fieldName: "Recieved Text Background",
        value: newRecievedTextBackground,
      },
      { fieldName: "Recieved Text Color", value: newRecievedTextColor },
      { fieldName: "Sent Text Background", value: newSentTextBackground },
      { fieldName: "Sent Text Color", value: newSentTextColor },
      { fieldName: "Theme Name", value: newThemeName },
    ];

    const emptyFields = requiredFields.filter((field) => field.value === "");

    if (emptyFields.length === 0) {
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
        setCreateThemeModalShow(true);
        setAddThemeSuccess(true);
        setClickCreateThemeModalTitle("Theme Created Successfully");
        setClickCreateThemeModalMessage("");
        props.getAllThemeData();
        resetAllInputs();
        onLeaveAddTheme();
      } catch (e) {
        setCreateThemeModalShow(true);
        setClickCreateThemeModalTitle("Unable To Add Theme");
        setClickCreateThemeModalMessage(e);
        console.log("Error adding theme: ", e);
      }
    } else {
      const emptyFieldNames = emptyFields
        .map((field) => field.fieldName)
        .join(", ");
      setCreateThemeModalShow(true);
      setClickCreateThemeModalTitle("Unable To Add Theme");
      setClickCreateThemeModalMessage(
        `The following fields are blank: ${emptyFieldNames}`
      );
      console.log("The following fields are blank:", emptyFieldNames);
    }
  };

  const resetAllInputs = () => {
    setNewThemeName("New Theme");
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
    console.log("newRecievedTextBackground", newRecievedTextBackground);

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
    setEditingRecievedColor(!editingRecievedColor);
    setEditingPrimaryColor(false);
    if (newRecievedTextBackground !== "") {
      setHexColor(newRecievedTextBackground);
    } else {
      setHexColor(selectedThemeData.recievedBubbleColor);
    }
  };

  const handleSentMessageClick = () => {
    setEditingRecievedColor(false);
    setEditingSentColor(!editingSentColor);
    setEditingPrimaryColor(false);
    if (newSentTextBackground !== "") {
      setHexColor(newSentTextBackground);
    } else {
      setHexColor(selectedThemeData.sentBubbleColor);
    }
  };

  const handlePrimaryButtonClicked = () => {
    setEditingRecievedColor(false);
    setEditingSentColor(false);
    setEditingPrimaryColor(!editingPrimaryColor);
    if (newPrimaryColor !== "") {
      setHexColor(newPrimaryColor);
    } else {
      setHexColor(selectedThemeData.primary);
    }
  };

  const getAllPublicThemes = () => {
    const ownedThemes = [];
    const publicThemes = [];

    allThemesData.forEach((theme) => {
      const isOwned = theme.creatorId === user.userId;

      if (isOwned || theme.name === "Default Theme") {
        ownedThemes.push(theme);
      } else {
        publicThemes.push(theme);
      }
    });

    // Sort themes alphabetically by theme.name
    ownedThemes.sort((a, b) => a.name.localeCompare(b.name));
    publicThemes.sort((a, b) => a.name.localeCompare(b.name));

    setPublicThemes(publicThemes);
    setOwnedThemes(ownedThemes);
  };

  useEffect(() => {
    console.log("hexColor", hexColor);
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
    changeSelectedTheme(theme);
  };

  const onLeaveAddTheme = () => {
    setEditingPrimaryColor(false);
    setAddingNewTheme(false);
    setEditingRecievedColor(false);
    setEditingSentColor(false);
    setNewPrimaryTextColor("");
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
        <Modal
          show={createThemeModalShow}
          modalTitle={clickCreateThemeModalTitle}
          modalContent={clickCreateThemeModalMessage}
          theme={
            user?.themeMode === "light"
              ? user?.selectedThemeData?.selectedThemeLight || LightTheme
              : user?.selectedThemeData?.selectedThemeDark || darktheme
          }
          actionButtonColor={
            addThemeSuccess
              ? user?.themeMode === "light"
                ? user?.selectedThemeData?.selectedThemeLight.primary ||
                  LightTheme.primary
                : user?.selectedThemeData?.selectedThemeDark.primary ||
                  darktheme.primary
              : user?.selectedThemeData?.selectedThemeLight.error ||
                LightTheme.error
          }
          handleModalClose={() => {
            if (addThemeSuccess) {
              setAddThemeSuccess(false);
            }
            setCreateThemeModalShow(false);
          }}
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

        <ThemePreviewBigContainer>
          {addingNewTheme ? (
            <>
              <AddThemeTopBar>
                <AddThemeTitle> Create New Theme</AddThemeTitle>
                <AddThemeSubtitle>
                  Click on the part of the preview you want to edit
                </AddThemeSubtitle>
              </AddThemeTopBar>
            </>
          ) : (
            <ChatPreviewTitle>Chat Preview</ChatPreviewTitle>
          )}
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

              <HightLightContainer
                highlighted={editingRecievedColor}
                borderColor={
                  editingRecievedColor || newRecievedTextBackground !== ""
                    ? newRecievedTextBackground
                    : selectedThemeData.recievedBubbleColor
                }
              >
                {/* Recieved Message */}
                <RecievedMessageBubble
                  highlighted={editingRecievedColor}
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
                    if (addingNewTheme) {
                      handleRecievedMessageClick();
                    }
                  }}
                >
                  hi
                </RecievedMessageBubble>
              </HightLightContainer>
            </MessagePreviewContainer>
            <MessagePreviewContainer>
              <HightLightContainer
                highlighted={editingRecievedColor}
                borderColor={
                  editingRecievedColor || newRecievedTextBackground !== ""
                    ? newRecievedTextBackground
                    : selectedThemeData.recievedBubbleColor
                }
              >
                <RecievedMessageBubble
                  highlighted={editingRecievedColor}
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
                    if (addingNewTheme) {
                      handleRecievedMessageClick();
                    }
                  }}
                >
                  how are you doing?
                </RecievedMessageBubble>
              </HightLightContainer>
            </MessagePreviewContainer>
            <MessagePreviewContainer>
              <SentMessageContainer>
                <HighLightContainerSent
                  style={{ alignItems: "flex-end" }}
                  highlighted={editingSentColor}
                  borderColor={
                    editingSentColor || newSentTextBackground !== ""
                      ? newSentTextBackground
                      : selectedThemeData.sentBubbleColor
                  }
                >
                  <SentMessageBubble
                    highlighted={editingSentColor}
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
                      if (addingNewTheme) {
                        handleSentMessageClick();
                      }
                    }}
                  >
                    I'm fine thank you
                  </SentMessageBubble>
                </HighLightContainerSent>
              </SentMessageContainer>
              <MessagePreviewPrimaryContainer>
                <HightLightContainerPrimary
                  highlighted={editingPrimaryColor}
                  borderColor={
                    editingPrimaryColor || newPrimaryColor !== ""
                      ? newPrimaryColor
                      : selectedThemeData.primary
                  }
                >
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
                      if (addingNewTheme) {
                        handlePrimaryButtonClicked();
                      }
                    }}
                  >
                    Primary Colour
                  </MessagePreviewPrimary>
                </HightLightContainerPrimary>
              </MessagePreviewPrimaryContainer>
            </MessagePreviewContainer>
          </ThemePreviewContainer>
        </ThemePreviewBigContainer>
        {addingNewTheme ? (
          <AddNewThemeContainer>
            {editingRecievedColor || editingPrimaryColor || editingSentColor ? (
              <>
                <ColourWheelContainer>
                  <HexColorPicker
                    color={hexColor}
                    onChange={setHexColor}
                  ></HexColorPicker>
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

            <AddThemeInputContainer>
              <AddThemeDetailsSubtitle>Theme Name</AddThemeDetailsSubtitle>
              <AddThemeInput
                onChange={(e) => {
                  setNewThemeName(e.target.value);
                }}
                value={newThemeName}
                type="text"
              />
            </AddThemeInputContainer>

            <AddThemeButtonBar>
              <AddThemeButton
                borderColor={selectedThemeData.primary}
                background={selectedThemeData.primary}
                color={getBestTextColor(selectedThemeData.primary)}
                onClick={() => {
                  addTheme();
                }}
              >
                Create Theme
              </AddThemeButton>
              <AddThemeButton
                onClick={() => {
                  onLeaveAddTheme();
                }}
              >
                Back
              </AddThemeButton>
            </AddThemeButtonBar>
          </AddNewThemeContainer>
        ) : (
          <ThemeTopBarAndCarousellContainer>
            <ThemesTopBar>
              <PublicThemeContainerTitle>My Themes</PublicThemeContainerTitle>
              <AddNewThemeButton
                background={selectedThemeData.primary}
                color={getBestTextColor(selectedThemeData.primary)}
                onClick={() => {
                  setNewPrimaryColor(selectedThemeData.primary);
                  setNewRecievedTextBackground(
                    selectedThemeData.recievedBubbleColor
                  );
                  setNewRecievedTextColor(selectedThemeData.recievedTextColor);
                  setNewSentTextBackground(selectedThemeData.sentBubbleColor);
                  setNewSentTextColor(selectedThemeData.sentTextColor);
                  setAddingNewTheme(true);
                }}
              >
                Create Theme
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
          </ThemeTopBarAndCarousellContainer>
        )}
      </ThemePageContainer>
    </ThemeProvider>
  );
};

export default ThemePage;
