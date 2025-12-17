import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import axios from "axios";

export function useRekomendasi() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRekomendasi = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/dashboard/recommendations");
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      // Axios errors have structured info: err.response, err.request, err.message
      console.error("Error fetching rekomendasi (raw):", err);

      // Jika ini adalah AxiosError, cek response
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Server merespons dengan status (mis. 500)
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);
          // Coba ambil message yang jelas dari response
          const serverMsg =
            err.response.data?.error ||
            err.response.data?.message ||
            JSON.stringify(err.response.data);

          setError(
            `Kesalahan server (${err.response.status}): ${serverMsg}`
          );
        } else if (err.request) {
          // Request dikirim tapi tidak ada response
          console.error("No response received. Request:", err.request);
          setError("Tidak menerima respons dari server. Periksa koneksi atau server.");
        } else {
          // Error saat menyiapkan request
          console.error("Request setup error:", err.message);
          setError(`Error: ${err.message}`);
        }
      } else {
        // Bukan Axios error
        setError("Terjadi kesalahan saat mengambil data rekomendasi");
      }

      // clear data if error
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRekomendasi();
  }, [fetchRekomendasi]);

  return { data, loading, error, refetch: fetchRekomendasi };
}
