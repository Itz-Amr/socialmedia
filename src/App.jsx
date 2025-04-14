import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import MainLayout from "./Layouts/mainLayout";
import Chat from "./Pages/Chat Page/UI";
import ErrorPage from "./Pages/404 Page";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout />}></Route>

        <Route path="/chat" element={<Chat />}></Route>

        <Route path="/">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </div>
  );
}
