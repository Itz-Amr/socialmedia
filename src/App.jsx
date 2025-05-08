import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import MainLayout from "./Layouts/mainLayout";
import Chat from "./Pages/Chat Page/UI";
import ErrorPage from "./Pages/404 Page";
import Profile from "./Pages/Profile Page/UI";
import Home from "./Pages/Home Page/UI";
import { ProtectedRoute } from "./Components/Protected Routes/ProtectedRoute";
import { initializeAuth, useAuthStore } from "./Store/authStore";
import LoadingModal from "./Components/Loading Modal";

export default function App() {
  useEffect(() => {
    console.log("Initializing auth");
    const cleanup = initializeAuth();
    return cleanup;
  }, []);

  const { loading } = useAuthStore();

  if (loading) {
    return <LoadingModal />;
  }

  return (
    <div className="App">
      <Routes>
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:userId" element={<Profile />} />
          </Route>
          <Route path="/chat" element={<Chat />} />
        </Route>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}
