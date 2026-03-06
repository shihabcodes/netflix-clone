import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    if (!auth) throw new Error("Firebase auth is not initialized.");
    const result = await signInWithEmailAndPassword(auth, email, password);
    setUser(result.user);
    return result.user;
  };

  const signUp = async (email, password) => {
    if (!auth) throw new Error("Firebase auth is not initialized.");
    const result = await createUserWithEmailAndPassword(auth, email, password);
    setUser(result.user);
    return result.user;
  };

  const signOutUser = async () => {
    if (!auth) return;
    await signOut(auth);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      signOut: signOutUser,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
