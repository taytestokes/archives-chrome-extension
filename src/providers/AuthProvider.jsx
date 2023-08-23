import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const getTokenFromStorage = () =>
    chrome.storage.local.get(["token"]).then(({ token }) => {
      if (token) setToken(token);
    });

  const setTokenToStorage = (token) =>
    chrome.storage.local.set({ token }).then(() => {
      setToken(token);
    });

  const clearTokenFromStorage = () =>
    chrome.storage.local.remove(["token"]).then(() => {
      setToken(null);
    });

  useEffect(() => {
    getTokenFromStorage();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        setTokenToStorage,
        clearTokenFromStorage,
      }}
    >
      {typeof children === "function" ? children() : children}
    </AuthContext.Provider>
  );
};
