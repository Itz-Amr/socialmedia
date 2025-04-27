import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import MainLayout from "./Layouts/mainLayout";
import Chat from "./Pages/Chat Page/UI";
import ErrorPage from "./Pages/404 Page";
import Profile from "./Pages/Profile Page/UI";
import Home from "./Pages/Home Page/UI";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />

          <Route path="profile" element={<Profile />} />

          <Route path="profile/:userId" element={<Profile />} />
        </Route>

        <Route path="/chat" element={<Chat />} />

        <Route path="/login" element={<Login />} />

        <Route path="register" element={<Register />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}
