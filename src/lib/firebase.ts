// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHiZvTaRt7dUuFHi3CZNuY5d0Hzr18ZKU",
  authDomain: "reithemedsi.firebaseapp.com",
  projectId: "reithemedsi",
  storageBucket: "reithemedsi.firebasestorage.app",
  messagingSenderId: "541365378521",
  appId: "1:541365378521:web:a485d9766dfa0bf0a70dc8",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Named database created on the Spark plan (the "(default)" one would require billing).
export const db = getFirestore(app, "default");