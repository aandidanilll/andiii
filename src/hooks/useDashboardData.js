import { useState, useEffect } from "react";
import api from "../services/api";

export function useDashboardData() {
  const [user, setUser] = useState(null);
  const [learningPaths, setLearningPaths] = useState([]); // Ganti enrollments jadi learningPaths
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ambil data user
    try {
      const storedUser = localStorage.getItem("user_data");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Gagal parsing user data", e);
    }

    const fetchData = async () => {
      try {
        // 2. Fetch Dashboard Data
        const response = await api.get("/dashboard");

        // Simpan mentah-mentah sesuai struktur JSON
        // Tidak perlu di-flatten / di-looping untuk dipecah
        setLearningPaths(response.data || []);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { user, learningPaths, loading };
}
