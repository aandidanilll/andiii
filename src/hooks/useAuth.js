// src/hooks/useAuth.js
import { useState } from "react";
import api from "../services/api";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password, onSuccess) => {
    setLoading(true);
    setError(null);
    try {
      // Sesuai README: POST /api/auth/login
      const response = await api.post("/auth/login", { email, password });

      const { user, session } = response.data;

      if (session && session.access_token) {
        // 1. Simpan Token
        localStorage.setItem("access_token", session.access_token);

        // 2. Simpan Data User (PENTING: karena GET dashboard tidak memberi data user)
        // Kita simpan object user sebagai string JSON
        localStorage.setItem("user_data", JSON.stringify(user));

        if (onSuccess) onSuccess(user);
      } else {
        setError("Login gagal, tidak ada session.");
      }
    } catch (err) {
      console.error("Login error:", err);
      // Menangani error response 400 dari dokumentasi
      setError(err.response?.data?.error || "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
