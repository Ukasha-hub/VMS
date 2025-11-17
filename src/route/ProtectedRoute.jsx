import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const jsonParam = queryParams.get("json");

  // If authenticated OR there's a json payload, allow access
  if (!isAuthenticated && !jsonParam) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
