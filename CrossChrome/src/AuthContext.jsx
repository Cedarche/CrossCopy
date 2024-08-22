import React, { createContext, useState, useEffect, useContext } from "react";
import { auth, signOut, onAuthStateChanged } from "../firebase";
import axios from "axios";
import { API_URL } from "./URL";
// Create a context for the user's authentication state
const AuthContext = createContext();

// Create a provider component for the AuthContext
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listenForCopy, setListenForCopy] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        setUser(user);
        setLoading(false);
      } else {
        // No user is signed in.
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    signOut(auth).then(() => {
      setUser(null);
    });
  };

  const value = {
    user,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Create a custom hook that allows components to access the auth context
export function useAuth() {
  return useContext(AuthContext);
}
