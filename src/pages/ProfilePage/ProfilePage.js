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
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import { useContext } from "react";
import { useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoAddOutline } from "react-icons/io5";
import { useRef } from "react";
import { useEffect } from "react";
import { handleSignOut } from "../../database/functions/handleSignOut";

const ProfilePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const user = useContext(UserContext);

  console.log("user", user);

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

  return (
    <ThemeProvider theme={user?.themeMode === "light" ? lightTheme : darktheme}>
      <ProfilePageContainer>
        <ProfilePageProfilePictureContainer
          src={user?.profilePicture[pictureCounter]}
        >
          <ProfilePageProfilePictureContainerSide
            onClick={() => {
              if (pictureCounter === 0) {
                setPictureCounter(user?.profilePicture.length - 1);
              } else {
                setPictureCounter((prevState) => prevState - 1);
              }
            }}
          />
          <ProfilePageProfilePictureContainerSide
            onClick={() => {
              if (pictureCounter === user?.profilePicture.length - 1) {
                setPictureCounter(0);
              } else {
                setPictureCounter((prevState) => prevState + 1);
              }
            }}
          />

          <ProfilePagePictureCounter>
            {pictureCounter + 1 + "/" + user?.profilePicture.length}
          </ProfilePagePictureCounter>
          <ProfilePageProfilePictureIcon>
            <IoTrashOutline
              color={
                user?.themeMode === "light" ? lightTheme.white : darktheme.white
              }
              size={"25px"}
            />
          </ProfilePageProfilePictureIcon>
          <ProfilePageProfilePictureBackIcon
            onClick={() => {
              navigate("/home");
            }}
          >
            <IoArrowBackOutline
              style={{ cursor: "pointer" }}
              color={
                user?.themeMode === "light" ? lightTheme.white : darktheme.white
              }
              size={"25px"}
            />
          </ProfilePageProfilePictureBackIcon>
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
                user?.themeMode === "light" ? lightTheme.white : darktheme.white
              }
            />
          </ProfilePageProfilePictureButton>
        </ProfilePageProfilePictureContainer>
        <ProfilePageDetailsContainer>
          <ProfilePageDetailsSubtitleAndTitleGroup>
            <ProfilePageDetailsSubtitle>Username</ProfilePageDetailsSubtitle>
            <ProfilePageDetailsTitle>{user?.username}</ProfilePageDetailsTitle>
          </ProfilePageDetailsSubtitleAndTitleGroup>

          <ProfilePageDetailsSubtitleAndTitleGroup>
            <ProfilePageDetailsSubtitle>Bio</ProfilePageDetailsSubtitle>
            <ProfilePageDetailsTitle>{user?.bio}</ProfilePageDetailsTitle>
          </ProfilePageDetailsSubtitleAndTitleGroup>
        </ProfilePageDetailsContainer>

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
      </ProfilePageContainer>
    </ThemeProvider>
  );
};

export default ProfilePage;
