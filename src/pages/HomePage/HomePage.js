import { ThemeProvider } from "styled-components";
import Chatbox from "../../components/Chatbox1/Chatbox";
import { HomePageContainer } from "./HomePageStyles";
import { theme } from "../../theme";
import { useContext } from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Chatbox2 from "../../components/Chatbox2/Chatbox2";

const HomePage = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const auth = getAuth();
  const handleSignOut = async () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
        console.log("Sign out successful");
      })
      .catch((error) => {
        console.log("Error when signing out: ", error);
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const authId = user.uid;
      } else {
        console.log("No user ");
        navigate("/login");
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {user !== null ? (
        <>
          <HomePageContainer>
            {user?.id}
            <br />
            {user?.username}
            <br />

            <button
              onClick={() => {
                handleSignOut();
              }}
            >
              Sign Out
            </button>
            {/* {user?.id === "HS0C0UK0yLbSQB2CGonB" ? (
              <Chatbox2
                userId={user?.id}
                otherPersonId="CPURpFaoZqyKZahmc9uI"
              />
            ) : user?.id === "CPURpFaoZqyKZahmc9uI" ? (
              <Chatbox2
                userId={user?.id}
                otherPersonId="HS0C0UK0yLbSQB2CGonB"
              />
            ) : (
              <Chatbox2 userId={user?.id} otherPersonId="2" />
            )} */}
            <Chatbox2 userId={user?.id} otherPersonId="HS0C0UK0yLbSQB2CGonB" />
            <Chatbox2 userId="HS0C0UK0yLbSQB2CGonB" otherPersonId={user?.id} />
          </HomePageContainer>
        </>
      ) : (
        <>
          You are not logged in. Pleae log in to view messages
          <br />
          <button
            onClick={() => {
              navigate("/login");
            }}
          >
            Back
          </button>
        </>
      )}
    </ThemeProvider>
  );
};

export default HomePage;
