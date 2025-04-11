// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuRX4pox0ewYF5shBDfp4YsiFIwfkMlsk",
  authDomain: "inkblink-5d5fa.firebaseapp.com",
  projectId: "inkblink-5d5fa",
  storageBucket: "inkblink-5d5fa.firebasestorage.app",
  messagingSenderId: "706935704595",
  appId: "1:706935704595:web:17892653a464fbc9af43e6",
  measurementId: "G-QWCZHXV5PM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app)
