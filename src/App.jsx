import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login.jsx";
import Home from "./dashboard/Home.jsx";
import Dashboard from "./dashboard/Dashboard.jsx";
import DashboardDetail from "./dashboard/DashboardDetail.jsx";
import Runtutan from "./dashboard/runtutan.jsx";
import Koridorkls from "./dashboard/koridorkls.jsx";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setEmail] = useState("");

  const handleLogin = (userEmail) => {
    setEmail(userEmail);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home onLogout={handleLogout} />} />
        <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
        <Route path="/koridorkls/detail" element={<DashboardDetail onLogout={handleLogout} />} />
        <Route path="/runtutan" element={<Runtutan onLogout={handleLogout} />} />
        <Route path="/koridorkls" element={<Koridorkls onLogout={handleLogout} />} />
        <Route path="/homeselengkapnya" element={<Dashboard onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
