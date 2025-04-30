import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";

export const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuthStore();

  console.log("Protected Route render:", {
    loading,
    isAuthenticated: !!currentUser,
  });

  // If auth is loading, show a loading indicator or nothing
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, render the child routes
  return children || <Outlet />;
};
