// src/hooks/useCourseDetail.js
import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useCourseDetail(enrollmentId) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // [Source: 9] Fetch Detail Course
  const fetchDetail = useCallback(async () => {
    if (!enrollmentId) return;
    try {
      const res = await api.get(`/dashboard/${enrollmentId}`);
      setDetail(res.data);
    } catch (err) {
      console.error("Error fetching detail:", err);
    } finally {
      setLoading(false);
    }
  }, [enrollmentId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // [Source: 11, 12] Action: Tandai Selesai
  const markModuleComplete = async (tutorialId) => {
    if (updating) return;
    setUpdating(true);
    try {
      // Tembak API progress
      await api.post(`/progress/tutorials/${tutorialId}`, {
        status: "completed",
      });

      // [Source: 13, 14] Update state lokal (Refresh data untuk hitung ulang %)
      await fetchDetail();
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setUpdating(false);
    }
  };

  return { detail, loading, updating, markModuleComplete };
}
