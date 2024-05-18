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
export const UserContext = createContext();
function App() {
  const [userData, setUserData] = useState(null);
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
        getUserData(authId);
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
    console.log("user id:", userData);
    setUserData({ id: doc.id, ...userData });
  };

  return (
    <UserContext.Provider value={userData}>
      <BrowserRouter>
        <Suspense>
          <Routes>
            <Route path="/*" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/chat/:chatid" element={<ChatPage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
