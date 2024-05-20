import { ThemeProvider } from "styled-components";
import { darktheme, lightTheme } from "../../theme";
import {
  ProfilePageButton,
  ProfilePageButtonContainer,
  ProfilePageContainer,
  ProfilePageDetailsContainer,
  ProfilePageDetailsSubtitle,
  ProfilePageDetailsSubtitleAndTitleGroup,
  ProfilePageDetailsTitle,
  ProfilePagePictureCounter,
  ProfilePagePictureCounterAndIconGroup,
  ProfilePageProfilePictureBackIcon,
  ProfilePageProfilePictureButton,
  ProfilePageProfilePictureContainer,
  ProfilePageProfilePictureContainerSide,
  ProfilePageProfilePictureIcon,
} from "./ProfilePageStyles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import { useContext } from "react";
import { useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoAddOutline } from "react-icons/io5";
import { useRef } from "react";
import { useEffect } from "react";
import { handleSignOut } from "../../database/functions/handleSignOut";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../database/firebase";

const ProfilePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useContext(UserContext);

  const [pictureCounter, setPictureCounter] = useState(0);

  const fileInputRef = useRef(null);
  const [messageFile, setMessageFile] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setMessageFile(file);
    console.log("file", file);
  };
  const handleAddPicture = () => {
    setMessageFile(null);
    fileInputRef.current.click();
  };

  //TODO: Add confirmation modal for uploading new pic
  useEffect(() => {
    console.log("messageFile", messageFile);
  }, [messageFile]);
  //  TODO: check if user is at his own page, if yes then allow edit if not then normal profile viewing

  const [viewingOwnProfile, setViewingOwnProfile] = useState(false);
  const [otherUserData, setOtherUserData] = useState(null);

  useEffect(() => {
    setViewingOwnProfile(user?.userId === params.userId);
  }, [user, params]);

  useEffect(() => {
    if (!viewingOwnProfile) {
      getOtherUserData();
    }
  }, [viewingOwnProfile]);

  const getOtherUserData = async () => {
    let otherPersonData = {};
    const docRef = doc(db, "users", params.userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      otherPersonData = { ...docSnap.data(), userId: docSnap.id };
      setOtherUserData(otherPersonData);
    } else {
      console.log("No such document!");
    }
  };

  const handleNavigateBack = () => {
    if (location.key !== "default") {
      // If location key is not 'default', it means there is a history entry
      navigate(-1);
    } else {
      // Otherwise, navigate to a different page (e.g., home)
      navigate("/home");
    }
  };

  return (
    <ThemeProvider theme={user?.themeMode === "light" ? lightTheme : darktheme}>
      <ProfilePageContainer>
        <ProfilePageProfilePictureContainer
          src={user?.profilePicture[pictureCounter]}
        >
          <ProfilePageProfilePictureContainerSide
            onClick={() => {
              if (pictureCounter === 0) {
                setPictureCounter(
                  viewingOwnProfile
                    ? user?.profilePicture.length - 1
                    : otherUserData?.profilePicture.length - 1
                );
              } else {
                setPictureCounter((prevState) => prevState - 1);
              }
            }}
          />
          <ProfilePageProfilePictureContainerSide
            onClick={() => {
              if (
                viewingOwnProfile
                  ? pictureCounter === user?.profilePicture.length - 1
                  : pictureCounter === otherUserData?.profilePicture.length - 1
              ) {
                setPictureCounter(0);
              } else {
                setPictureCounter((prevState) => prevState + 1);
              }
            }}
          />

          <ProfilePagePictureCounter viewingOwnProfile={viewingOwnProfile}>
            {pictureCounter + 1 + "/" + otherUserData?.profilePicture.length}
          </ProfilePagePictureCounter>

          {viewingOwnProfile ? (
            <ProfilePageProfilePictureIcon>
              <IoTrashOutline
                color={
                  user?.themeMode === "light"
                    ? lightTheme.white
                    : darktheme.white
                }
                size={"25px"}
              />
            </ProfilePageProfilePictureIcon>
          ) : (
            <></>
          )}

          <ProfilePageProfilePictureBackIcon onClick={handleNavigateBack}>
            <IoArrowBackOutline
              style={{ cursor: "pointer" }}
              color={
                user?.themeMode === "light" ? lightTheme.white : darktheme.white
              }
              size={"25px"}
            />
          </ProfilePageProfilePictureBackIcon>

          {viewingOwnProfile ? (
            <ProfilePageProfilePictureButton onClick={handleAddPicture}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  display: "none",
                }}
              />
              <IoAddOutline
                size={"34px"}
                color={
                  user?.themeMode === "light"
                    ? lightTheme.white
                    : darktheme.white
                }
              />
            </ProfilePageProfilePictureButton>
          ) : (
            <></>
          )}
        </ProfilePageProfilePictureContainer>
        <ProfilePageDetailsContainer>
          <ProfilePageDetailsSubtitleAndTitleGroup>
            <ProfilePageDetailsSubtitle>Username</ProfilePageDetailsSubtitle>
            <ProfilePageDetailsTitle>
              {viewingOwnProfile ? user?.username : otherUserData?.username}
            </ProfilePageDetailsTitle>
          </ProfilePageDetailsSubtitleAndTitleGroup>

          <ProfilePageDetailsSubtitleAndTitleGroup>
            <ProfilePageDetailsSubtitle>Bio</ProfilePageDetailsSubtitle>
            <ProfilePageDetailsTitle>
              {viewingOwnProfile ? user?.bio : otherUserData?.bio}
            </ProfilePageDetailsTitle>
          </ProfilePageDetailsSubtitleAndTitleGroup>
        </ProfilePageDetailsContainer>

        {viewingOwnProfile ? (
          <ProfilePageButtonContainer>
            <ProfilePageButton
              onClick={() => {
                handleSignOut();
                navigate("/login");
              }}
            >
              Sign Out
            </ProfilePageButton>
          </ProfilePageButtonContainer>
        ) : (
          <></>
        )}
      </ProfilePageContainer>
    </ThemeProvider>
  );
};

export default ProfilePage;
