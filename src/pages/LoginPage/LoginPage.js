import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { LoginPageContainer } from "./LoginPageStyles";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import { theme, theme2 } from "../../theme";
import { ThemeProvider } from "styled-components";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../../database/firebase";

const LoginPage = (props) => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [showLogInFailureModal, setShowLogInFailureModal] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [loginFailureMessage, setLoginFailureMessage] = useState("");

  const handleLogin = async () => {
    signInWithEmailAndPassword(auth, inputEmail, inputPassword)
      .then((userCredential) => {
        navigate("/home");
        console.log("logged in successful");
      })
      .catch((e) => {
        setLoginFailureMessage(e.message);
        setShowLogInFailureModal(true);
        console.log("error in sign in: ", e.code, e.message);
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        navigate("/home");
      } else {
        //Not signed in
        //console.log("User not signed in yet");
      }
    });
  }, []);

  //--------------------------------------Sign Up methods--------------------------------------

  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserUsername, setNewUserUsername] = useState("");
  const [newConfirmUserPassword, setNewConfirmUserPassword] = useState("");

  const handleSignUp = async () => {
    if (newUserPassword === newConfirmUserPassword) {
      if (newUserUsername !== "") {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            newUserEmail,
            newUserPassword
          );
          const user = userCredential.user;
          const authId = user.uid;
          addNewUserToCollection(authId);
          console.log("User created successfully");
        } catch (e) {
          setLoginFailureMessage(e.message);
          setShowLogInFailureModal(true);
          console.log("Error signing up user: ", e);
        }
      } else {
        setLoginFailureMessage("No username entered");
        setShowLogInFailureModal(true);
      }
    } else {
      setLoginFailureMessage("Passwords do not match");
      setShowLogInFailureModal(true);
    }
  };

  const addNewUserToCollection = async (authId) => {
    const usersRef = collection(db, "users");
    const currentDate = new Date();
    const timestamp = Timestamp.fromDate(currentDate);

    try {
      const userDocRef = await addDoc(usersRef, {
        authId: authId,
        username: newUserUsername,
        dateAdded: timestamp,
        themeMode: "light",
        profilePicture:
          "https://firebasestorage.googleapis.com/v0/b/eh-messager.appspot.com/o/profilePictures%2Fphoto_2024-05-19%2015.40.14.jpeg?alt=media&token=13e40b41-8311-4f84-a881-8a70436b2318",
      });
      console.log("user added", userDocRef);
    } catch (e) {
      console.log("Error adding user to users collection");
    }
  };
  //--------------------------------------------------------------------------------------------

  return (
    <ThemeProvider theme={theme}>
      <Modal
        handleModalClose={() => {
          setShowLogInFailureModal(false);
          setLoginFailureMessage("");
        }}
        actionButtonText="OK"
        actionButtonColor={theme.statusError}
        actionButtonClick={() => {}}
        show={showLogInFailureModal}
        modalTitle="Error"
        modalContent={loginFailureMessage}
      />
      <LoginPageContainer>
        <h2>Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => {
            setInputEmail(e.target.value);
          }}
        />
        <br />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => {
            setInputPassword(e.target.value);
          }}
        />
        <br />
        <button
          onClick={() => {
            handleLogin();
          }}
        >
          Sign In
        </button>

        <h2>Sign Up</h2>
        <input
          placeholder="Email"
          onChange={(e) => {
            setNewUserEmail(e.target.value);
          }}
        />
        <br />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => {
            setNewUserPassword(e.target.value);
          }}
        />
        <br />
        <input
          placeholder="Confirm Password"
          type="password"
          onChange={(e) => {
            setNewConfirmUserPassword(e.target.value);
          }}
        />
        <br />
        <input
          placeholder="Username"
          onChange={(e) => {
            setNewUserUsername(e.target.value);
          }}
        />

        <button
          onClick={() => {
            handleSignUp();
          }}
        >
          Sign Up
        </button>
      </LoginPageContainer>
    </ThemeProvider>
  );
};

export default LoginPage;
