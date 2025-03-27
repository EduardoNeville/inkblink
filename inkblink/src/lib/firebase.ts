import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAuRX4pox0ewYF5shBDfp4YsiFIwfkMlsk",
  authDomain: "inkblink-5d5fa.firebaseapp.com",
  projectId: "inkblink-5d5fa",
  storageBucket: "inkblink-5d5fa.firebasestorage.app",
  messagingSenderId: "706935704595",
  appId: "1:706935704595:web:17892653a464fbc9af43e6",
  measurementId: "G-QWCZHXV5PM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
