import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "./auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const LOCAL_STORAGE_KEY = "nextflix-my-list";

async function fetchServerList(uid) {
  if (!uid || !db) return [];
  const userDoc = doc(db, "userLists", uid);
  const snapshot = await getDoc(userDoc);
  return snapshot.exists() ? snapshot.data().items || [] : [];
}

async function writeServerList(uid, items) {
  if (!uid || !db) return items;
  const userDoc = doc(db, "userLists", uid);
  await setDoc(userDoc, { items }, { merge: true });
  return items;
}

export function useMyList() {
  const { user } = useAuth();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const saveLocal = useCallback((items) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }, []);

  const loadLocal = useCallback(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }, []);

  const syncFromServer = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const serverItems = await fetchServerList(user.uid);
    setList(serverItems);
    setLoading(false);
  }, [user]);

  const syncToServer = useCallback(
    async (items) => {
      if (!user) return items;
      await writeServerList(user.uid, items);
      return items;
    },
    [user],
  );

  const fetchList = useCallback(async () => {
    setLoading(true);
    if (user) {
      const serverItems = await fetchServerList(user.uid);
      setList(serverItems);
      setLoading(false);
      return;
    }

    const localItems = loadLocal();
    setList(localItems);
    setLoading(false);
  }, [user, loadLocal]);

  const updateList = useCallback(
    async (items) => {
      setList(items);
      saveLocal(items);
      await syncToServer(items);
    },
    [saveLocal, syncToServer],
  );

  const addItem = useCallback(
    async (item) => {
      const next = [...list];
      if (!next.some((x) => x.id === item.id)) {
        next.push(item);
      }
      await updateList(next);
    },
    [list, updateList],
  );

  const removeItem = useCallback(
    async (id) => {
      const next = list.filter((x) => x.id !== id);
      await updateList(next);
    },
    [list, updateList],
  );

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const value = useMemo(
    () => ({
      list,
      loading,
      addItem,
      removeItem,
      refresh: fetchList,
      isAuthenticated: Boolean(user),
    }),
    [list, loading, addItem, removeItem, fetchList, user],
  );

  return value;
}
