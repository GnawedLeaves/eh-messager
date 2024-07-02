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
  ProfilePageModalButton2,
  ProfilePageModalButtonsContainer,
  ProfilePageModalImage,
  ProfilePageModalAddPicTitle,
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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../../database/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Modal from "../../components/Modal/Modal";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const ProfilePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useContext(UserContext);

  const [pictureCounter, setPictureCounter] = useState(0);

  const fileInputRef = useRef(null);
  const [inputProfilePic, setInputProfilePic] = useState(null);
  const [showAddPicModal, setShowAddPicModal] = useState(false);
  const [messageFileForDisplay, setMessageFileForDisplay] = useState();

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

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setInputProfilePic(file);
    const fileURL = URL.createObjectURL(file); // Create a URL for the file
    setMessageFileForDisplay(fileURL);
    console.log("file", file);
  };
  const handleAddPicture = () => {
    setInputProfilePic(null);
    fileInputRef.current.click();
  };
  useEffect(() => {
    console.log("messageFile", inputProfilePic);
    console.log("user", user);
    if (inputProfilePic) {
      //show upload modal
      setShowAddPicModal(true);
    }
  }, [inputProfilePic]);

  const handleAddNewProfilePic = async () => {
    let attachmentUrl = null;
    let attachmentName = "";
    const timestamp = new Date().getTime();
    attachmentName = `file_${timestamp}_${inputProfilePic.name}`;
    // Get a reference to the storage location and the path where the file is saved
    const fileRef = ref(storage, `profilePictures/${attachmentName}`);
    // Upload the file to Firebase Storage
    try {
      await uploadBytes(fileRef, inputProfilePic);
      // Get the download URL of the uploaded file
      attachmentUrl = await getDownloadURL(fileRef);
      console.log("File uploaded successfully!", fileRef, attachmentUrl);

      //update the user array about new profile pic
      const userRef = doc(db, "users", user.userId);
      await updateDoc(userRef, {
        profilePicture: [attachmentUrl, ...user.profilePicture],
      });
    } catch (e) {
      console.log("Error uploading new profile pic", e);
    }
  };

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
        <Modal
          theme={user?.themeMode === "light" ? lightTheme : darktheme}
          modalType="empty"
          show={showAddPicModal}
          handleModalClose={() => {
            setShowAddPicModal(false);
          }}
        >
          <ProfilePageModalAddPicTitle>
            Upload Picture?
          </ProfilePageModalAddPicTitle>
          <ProfilePageModalImage src={messageFileForDisplay} />
          <ProfilePageModalButtonsContainer>
            <ProfilePageButton
              onClick={() => {
                handleAddNewProfilePic();
              }}
            >
              Upload
            </ProfilePageButton>
            <ProfilePageModalButton2>Cancel</ProfilePageModalButton2>
          </ProfilePageModalButtonsContainer>
        </Modal>
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
                if (handleSignOut()) {
                  console.log("logging in");
                  navigate("/login");
                }
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
