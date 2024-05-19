import { ThemeProvider } from "styled-components";
import Chatbox from "../../components/Chatbox1/Chatbox";
import { HomePageContainer } from "./ChatPageStyles";
import { theme } from "../../theme";
import { useContext } from "react";
import { UserContext } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Chatbox2 from "../../components/Chatbox2/Chatbox2";

const ChatPage = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const auth = getAuth();
  const params = useParams();

  console.log("params", params);
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
            {user?.userId}
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
            {/* {user?.userId === "HS0C0UK0yLbSQB2CGonB" ? (
              <Chatbox2
                userId={user?.userId}
                otherPersonId="CPURpFaoZqyKZahmc9uI"
              />
            ) : user?.userId === "CPURpFaoZqyKZahmc9uI" ? (
              <Chatbox2
                userId={user?.userId}
                otherPersonId="HS0C0UK0yLbSQB2CGonB"
              />
            ) : (
              <Chatbox2 userId={user?.userId} otherPersonId="2" />
            )} */}
            <Chatbox2 userId={user?.userId} otherPersonId={params.chatId} />
            <Chatbox2 userId={params.chatId} otherPersonId={user?.userId} />
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

export default ChatPage;
