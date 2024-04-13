// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbHz1eyG7zx3xWkq8u7WTjN9UEQXegQIk",
  authDomain: "eh-messager.firebaseapp.com",
  databaseURL:
    "https://eh-messager-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "eh-messager",
  storageBucket: "eh-messager.appspot.com",
  messagingSenderId: "920976784355",
  appId: "1:920976784355:web:85af615bcb6e249b5f7ed6",
  measurementId: "G-0YDBQ33Z5Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// other way too, export..
//const analytics = getAnalytics(app);

export const auth = getAuth();
// export const db = getFirestore(app);
export const db = getFirestore(app); // firebase.firestore(); if do the other way
export const storage = getStorage(app); // firebase.storage();
