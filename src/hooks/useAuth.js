// hooks/useAuth.js
// ─── Auth Hook ────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export function useAuth() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch extra profile from Firestore
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        setUser({ ...firebaseUser, profile: snap.data() || {} });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const register = async (email, password, name) => {
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      // Create user doc in Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
        settings: { darkMode: false, primaryColor: "#3b82f6", currency: "IDR" },
      });
      return { ok: true };
    } catch (e) {
      const msg = firebaseErrorMsg(e.code);
      setError(msg);
      return { ok: false, error: msg };
    }
  };

  const login = async (email, password) => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { ok: true };
    } catch (e) {
      const msg = firebaseErrorMsg(e.code);
      setError(msg);
      return { ok: false, error: msg };
    }
  };

  const logout = () => signOut(auth);

  return { user, loading, error, setError, register, login, logout };
}

function firebaseErrorMsg(code) {
  const map = {
    "auth/user-not-found":      "Email tidak ditemukan",
    "auth/wrong-password":      "Password salah",
    "auth/email-already-in-use":"Email sudah terdaftar",
    "auth/weak-password":       "Password minimal 6 karakter",
    "auth/invalid-email":       "Format email tidak valid",
    "auth/too-many-requests":   "Terlalu banyak percobaan, coba lagi nanti",
    "auth/invalid-credential":  "Email atau password salah",
  };
  return map[code] || "Terjadi kesalahan, coba lagi";
}
