import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import LoginPage from "./pages/LoginPage/LoginPage";
import OpenChatPage from "./pages/OpenChatPage/OpenChatPage";
import { useState, createContext, useContext } from "react";

import { useEffect } from "react";
import { db } from "./database/firebase";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ChatPage from "./pages/ChatPage/ChatPage";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ThemePage from "./pages/ThemePage/ThemePage";
import { handleFirebaseDate } from "./database/handleFirebaseDate";
export const UserContext = createContext();

function App() {
  const [userData, setUserData] = useState(null);
  const [allUserData, setAllUserData] = useState([]);
  const [allThemesData, setAllThemesData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  //handles when user signs in or signs up
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const authId = user.uid;
        // getAllUserData();
        // getUserFromAllUserData(authId)
        getAllUsers();
        getUserData(authId);
        getAllThemeData();
      } else {
        console.log("No user ");
        setUserData(null);
      }
    });
  }, []);

  const getAllUsers = async () => {
    let allUsers = [];
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      allUsers = [...allUsers, { userId: doc.id, ...docData }];
    });
    setAllUsers(allUsers);
  };

  const getUserData = async (authId) => {
    const userRef = collection(db, "users");
    const querySnapshot = await getDocs(
      query(userRef, where("authId", "==", authId))
    );
    const doc = querySnapshot.docs[0];
    const userData = doc?.data();
    const selectedThemeData = await getUserTheme(userData.themes[0]);
    setUserData({
      userId: doc.id,
      ...userData,
      selectedThemeData: selectedThemeData,
    });
    console.log("user data:", {
      userId: doc.id,
      ...userData,
      selectedThemeData: selectedThemeData,
    });
  };

  const getAllThemeData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "themes"));
      const allThemesData = [];
      querySnapshot.forEach((doc) => {
        allThemesData.push({ themeId: doc.id, ...doc.data() });
      });

      //clean up date here
      const timestamp = Timestamp.fromDate(new Date());
      const cleanedAllThemesData = allThemesData.map((theme) => {
        //clean up date
        console.log("theme.dateAdded", theme.dateAdded);
        console.log("theme.dateEdited", theme.dateEdited);

        const cleanedDateAdded = theme.dateAdded
          ? handleFirebaseDate(theme.dateAdded).substring(5)
          : timestamp;
        const cleanedDateEdited = theme.dateEdited
          ? handleFirebaseDate(theme.dateEdited).substring(5)
          : timestamp;

        const creatorUsername = allUserData.filter((user) => {
          return theme.userId === user.userId;
        });
        return {
          creatorUsername:
            creatorUsername.length > 0 ? creatorUsername[0] : null,
          ...theme,
          dateAdded: cleanedDateAdded,
          dateEdited: cleanedDateEdited,
        };
      });
      console.log("cleanedAllThemesData", cleanedAllThemesData);
      setAllThemesData(allThemesData);
      console.log("All theme data:", allThemesData);
      return allThemesData;
    } catch (error) {
      console.error("Error fetching theme data:", error);
    }
  };

  const getUserTheme = async (themeId) => {
    const allThemes = await getAllThemeData();
    const defaultThemeData = allThemes.filter((theme) => {
      return theme.themeId === "defaultTheme";
    });
    const selectedThemeData = allThemes.filter((theme) => {
      return theme.themeId === themeId;
    });

    // return default theme if cannot find theme
    if (selectedThemeData[0] === null) {
      return defaultThemeData[0];
    } else {
      return selectedThemeData[0];
    }
  };
  return (
    <UserContext.Provider value={userData}>
      <BrowserRouter>
        <Suspense>
          <Routes>
            <>
              <Route path="/*" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/chat/:chatId" element={<ChatPage />} />
              <Route
                path="/home"
                element={<HomePage getUserData={getUserData} />}
              />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route
                path="/theme"
                element={
                  <ThemePage
                    getUserData={getUserData}
                    getAllThemeData={getAllThemeData}
                    allThemesData={allThemesData}
                  />
                }
              />
            </>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
