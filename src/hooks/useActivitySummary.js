import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

export function useActivitySummary() {
  const [summary, setSummary] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivitySummary = useCallback(async () => {
    try {
      const res = await api.get("/dashboard/activity-summary");

      // ambil data sesuai struktur response API
      setSummary(res.data.summary);
      setActivity(res.data.activity);
    } catch (err) {
      console.error("Error fetching activity summary:", err);
      setError("Gagal mengambil data aktivitas belajar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivitySummary();
  }, [fetchActivitySummary]);

  return { summary, activity, loading, error };
}
