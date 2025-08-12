// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArk0AWXI9xwZ37qYLBwebN64lipwTwtyk",
  authDomain:  "ai-trip-planner-three-tawny.vercel.app",
  // "ai-trip-planner-a1fae.firebaseapp.com",
  projectId: "ai-trip-planner-a1fae",
  storageBucket: "ai-trip-planner-a1fae.firebasestorage.app",
  messagingSenderId: "127504505708",
  appId: "1:127504505708:web:ab10d58ada30af34d47149",
  measurementId: "G-WQV7BHRK25"
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);