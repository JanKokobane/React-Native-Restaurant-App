import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBn3H73r8BsOJXwgsdMCnn81d5ROQjqDSY",
  authDomain: "fooddash-aca97.firebaseapp.com",
  projectId: "fooddash-aca97",
  storageBucket: "fooddash-aca97.firebasestorage.app",
  messagingSenderId: "286626525854",
  appId: "1:286626525854:web:7d9a6c5ac84146224a418f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
