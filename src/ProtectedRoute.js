import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isLoggedIn = !!localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");
  const location = useLocation();

  console.log(isLoggedIn);
  const PublicPages = ["/login", "/register"];
  if (isLoggedIn && PublicPages.includes(location.pathname)) {
    return <Navigate to="/" />;
  }
  if (!isLoggedIn && !PublicPages.includes(location.pathname)) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
