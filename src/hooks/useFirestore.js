// hooks/useFirestore.js
// ─── Firestore Real-time Data Hook ───────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import {
  collection, doc,
  onSnapshot, addDoc, setDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, writeBatch, getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

// ─── Generic collection hook ──────────────────────────────────────────────────
function useCollection(uid, collectionName, order = "createdAt") {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setData([]); setLoading(false); return; }
    const ref = collection(db, "users", uid, collectionName);
    const q   = query(ref, orderBy(order, "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [uid, collectionName, order]);

  const add = useCallback(async (item) => {
    const ref = collection(db, "users", uid, collectionName);
    const { id: _id, ...data } = item; // strip local id
    await addDoc(ref, { ...data, createdAt: serverTimestamp() });
  }, [uid, collectionName]);

  const update = useCallback(async (id, item) => {
    const ref = doc(db, "users", uid, collectionName, id);
    const { id: _id, ...data } = item;
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  }, [uid, collectionName]);

  const remove = useCallback(async (id) => {
    await deleteDoc(doc(db, "users", uid, collectionName, id));
  }, [uid, collectionName]);

  const upsert = useCallback(async (id, item) => {
    const ref = doc(db, "users", uid, collectionName, id);
    const { id: _id, ...data } = item;
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  }, [uid, collectionName]);

  return { data, loading, add, update, remove, upsert };
}

// ─── Seed default data for new user ──────────────────────────────────────────
export async function seedUserData(uid, initialData) {
  const batch = writeBatch(db);

  const collections = {
    categories:  initialData.categories,
    accounts:    initialData.accounts,
    transactions:initialData.transactions,
    goals:       initialData.goals,
    recurrings:  initialData.recurrings,
  };

  for (const [col, items] of Object.entries(collections)) {
    // Check if already seeded
    const snap = await getDocs(collection(db, "users", uid, col));
    if (!snap.empty) continue; // already has data, skip

    for (const item of items) {
      const ref = doc(db, "users", uid, col, item.id);
      batch.set(ref, { ...item, createdAt: serverTimestamp() });
    }
  }

  await batch.commit();
}

// ─── User settings ────────────────────────────────────────────────────────────
export function useUserSettings(uid) {
  const [settings, setSettings] = useState({ darkMode: false, primaryColor: "#3b82f6" });

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(doc(db, "users", uid), (snap) => {
      if (snap.exists()) setSettings(snap.data().settings || {});
    });
    return unsub;
  }, [uid]);

  const saveSettings = useCallback(async (newSettings) => {
    if (!uid) return;
    await updateDoc(doc(db, "users", uid), { settings: newSettings });
  }, [uid]);

  return { settings, saveSettings };
}

// ─── Main data hook — bundles all collections ─────────────────────────────────
export function useFirestoreData(uid) {
  const transactions = useCollection(uid, "transactions", "date");
  const accounts     = useCollection(uid, "accounts",     "createdAt");
  const categories   = useCollection(uid, "categories",   "createdAt");
  const goals        = useCollection(uid, "goals",        "createdAt");
  const recurrings   = useCollection(uid, "recurrings",   "createdAt");

  const loading = transactions.loading || accounts.loading ||
                  categories.loading   || goals.loading || recurrings.loading;

  return { transactions, accounts, categories, goals, recurrings, loading };
}
