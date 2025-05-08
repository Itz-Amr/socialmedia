import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";
import LoadingModal from "../Loading Modal";

export const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuthStore();

  console.log("Protected Route render:", {
    loading,
    isAuthenticated: !!currentUser,
  });

  if (loading) {
    return <LoadingModal />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
};
