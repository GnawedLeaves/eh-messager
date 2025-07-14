import { ThemeProvider } from "styled-components";
import { HomePageContainer } from "./ChatPageStyles";
import { theme } from "../../theme";
import { useContext } from "react";
import { UserContext } from "../../App";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Chatbox2 from "../../components/Chatbox2/Chatbox2";
const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useContext(UserContext);
  const auth = getAuth();
  const params = useParams();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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

  const handleNavigateBack = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/home");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {user !== null ? (
        <>
          <HomePageContainer>
            <Chatbox2 userId={user?.userId} otherPersonId={params.chatId} />
          </HomePageContainer>
        </>
      ) : (
        <>
          You are not logged in. Pleae log in to view messages
          <br />
          <button onClick={handleNavigateBack}>Back</button>
        </>
      )}
    </ThemeProvider>
  );
};

export default ChatPage;
