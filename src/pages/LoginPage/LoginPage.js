import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  LoginPageAppTitle,
  LoginPageButton,
  LoginPageContainer,
  LoginPageSignUpSpan,
  LoginPageSignUpText,
  SignUpPageTitle,
} from "./LoginPageStyles";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import { lightTheme, theme, theme2 } from "../../theme";
import { ThemeProvider } from "styled-components";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../../database/firebase";
import LoginField from "../../components/LoginField/LoginField";

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

  const [showSignInPage, setShowSignInPage] = useState(true);

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
        profilePicture: [
          "hhttps://firebasestorage.googleapis.com/v0/b/eh-messager-2-d4818.appspot.com/o/profilePictures%2Ffile_1720006592709_rothus%20the%20traveler.png?alt=media&token=8320c536-1d6e-48f8-9ae2-a3684a73ded1",
        ],
        bio: "Eh hello",
        themeColor: {
          lightThemeBackground: "#F7F3E6",
          darkThemeBackground: "#1B1B1B",
          userTextBackgroundColor: "#F8865C",
          userTextColor: "#FEFBF1",
          otherUserTextBackgroundColor: "#ff787f",
          otherUserTextColor: "#FEFBF1",
        },
      });
      console.log("user added", userDocRef);
    } catch (e) {
      console.log("Error adding user to users collection");
    }
  };
  //--------------------------------------------------------------------------------------------

  return (
    <ThemeProvider theme={lightTheme}>
      <Modal
        theme={lightTheme}
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
      {showSignInPage ? (
        <LoginPageContainer>
          <LoginPageAppTitle>Eh</LoginPageAppTitle>
          <LoginField
            inputOnChange={(e) => {
              setInputEmail(e.target.value);
            }}
            placeholder={"Email"}
          />
          <LoginField
            inputOnChange={(e) => {
              setInputPassword(e.target.value);
            }}
            placeholder={"Password"}
            type="password"
          />
          <LoginPageButton
            onClick={() => {
              handleLogin();
            }}
          >
            Sign In
          </LoginPageButton>
          <LoginPageSignUpText>
            No account?{" "}
            <LoginPageSignUpSpan
              onClick={() => {
                setShowSignInPage(false);
              }}
            >
              Create One{" "}
            </LoginPageSignUpSpan>
          </LoginPageSignUpText>
        </LoginPageContainer>
      ) : (
        <LoginPageContainer>
          <SignUpPageTitle>Create Account</SignUpPageTitle>
          <LoginField
            inputOnChange={(e) => {
              setNewUserEmail(e.target.value);
            }}
            placeholder={"Email"}
          />
          <LoginField
            inputOnChange={(e) => {
              setNewUserUsername(e.target.value);
            }}
            placeholder={"Username"}
          />
          <LoginField
            inputOnChange={(e) => {
              setNewUserPassword(e.target.value);
            }}
            placeholder={"Password"}
            type="password"
          />
          <LoginField
            inputOnChange={(e) => {
              setNewConfirmUserPassword(e.target.value);
            }}
            placeholder={"Confirm Password"}
            type="password"
          />

          <LoginPageButton
            onClick={() => {
              handleSignUp();
            }}
          >
            Create Account
          </LoginPageButton>
          <LoginPageSignUpText>
            Already have an account?{" "}
            <LoginPageSignUpSpan
              onClick={() => {
                setShowSignInPage(true);
              }}
            >
              Sign In
            </LoginPageSignUpSpan>
          </LoginPageSignUpText>
        </LoginPageContainer>
      )}
    </ThemeProvider>
  );
};

export default LoginPage;
