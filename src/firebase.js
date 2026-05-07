import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNakAtYl34mMd85nQLhGARk1XyP_-MZyQ",
  authDomain: "financeku-cc5d2.firebaseapp.com",
  projectId: "financeku-cc5d2",
  storageBucket: "financeku-cc5d2.firebasestorage.app",
  messagingSenderId: "800923787484",
  appId: "1:800923787484:web:e50c390fc5129c66a35419"
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
