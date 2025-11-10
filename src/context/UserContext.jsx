// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // On app load, try to read user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Helper to update user both in state and localStorage
  const updateUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem("loggedInUser", JSON.stringify(user));
  };

  return (
    <UserContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
