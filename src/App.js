import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import LoginPage from "./pages/LoginPage/LoginPage";
import OpenChatPage from "./pages/OpenChatPage/OpenChatPage";
import { useState, createContext, useContext } from "react";

import { useEffect } from "react";
import { db } from "./database/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ChatPage from "./pages/ChatPage/ChatPage";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ThemePage from "./pages/ThemePage/ThemePage";
export const UserContext = createContext();

function App() {
  const [userData, setUserData] = useState(null);
  const [allUserData, setAllUserData] = useState([]);
  const [allThemesData, setAllThemesData] = useState([]);

  // {
  //   id: "test id",
  //   username: "testusername",
  // }

  //handles when user signs in or signs up
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const authId = user.uid;
        // getAllUserData();
        // getUserFromAllUserData(authId)
        getUserData(authId);
        getAllThemeData();
      } else {
        console.log("No user ");
        setUserData(null);
      }
    });
  }, []);

  const getUserData = async (authId) => {
    const userRef = collection(db, "users");
    const querySnapshot = await getDocs(
      query(userRef, where("authId", "==", authId))
    );
    const doc = querySnapshot.docs[0];
    const userData = doc?.data();
    // getAllThemeData();
    setUserData({ userId: doc.id, ...userData });
    console.log("user data:", { userId: doc.id, ...userData });
  };

  const getAllThemeData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "themes"));
      const allThemesData = [];
      querySnapshot.forEach((doc) => {
        allThemesData.push(doc.data()); // Push each document's data into the array
      });
      setAllThemesData(allThemesData);
      // console.log("All theme data:", allThemesData);
      return;
    } catch (error) {
      console.error("Error fetching theme data:", error);
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
