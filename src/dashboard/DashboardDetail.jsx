import { useSearchParams, useNavigate } from "react-router-dom";
import { useCourseDetail } from "../hooks/useCourseDetail";
import { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function DashboardDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const enrollmentId = searchParams.get("enrollmentId");

  const { detail, loading, markModuleComplete } =
    useCourseDetail(enrollmentId);

  // state untuk loading per tombol
  const [loadingId, setLoadingId] = useState(null);

  // popup untuk aturan runtut
  const [rulePopup, setRulePopup] = useState({
    visible: false,
    message: "",
  });

  // handler klik tombol + aturan runtut
  const handleMarkComplete = async (tutorialId) => {
    if (!detail) return;

    const tutorials = detail.tutorials;
    const currentIndex = tutorials.findIndex(
      (t) => t.tutorial_id === tutorialId
    );

    if (currentIndex === -1) return;

    // cek apakah masih ada tutorial sebelumnya yang belum completed
    const hasUnfinishedBefore = tutorials
      .slice(0, currentIndex)
      .some((t) => t.status !== "completed");

    if (hasUnfinishedBefore) {
      setRulePopup({
        visible: true,
        message:
          "Mohon selesaikan materi sebelumnya terlebih dahulu sebelum melanjutkan ke materi ini.",
      });
      return;
    }

    // kalau lolos aturan, baru proses tandai selesai
    setLoadingId(tutorialId);
    await markModuleComplete(tutorialId);
    setLoadingId(null);
  };

  // state popup digabung
  const [popupState, setPopupState] = useState({
    visible: false,
    alreadyShown: false,
  });

  // nilai turunan: apakah semua modul sudah selesai
  const allCompleted =
    detail &&
    detail.tutorials.length > 0 &&
    detail.tutorials.every((t) => t.status === "completed");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (allCompleted && !popupState.alreadyShown) {
      setPopupState({ visible: true, alreadyShown: true });
    }
  }, [allCompleted, popupState.alreadyShown]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (loading || !detail)
    return (
      <div className="text-center py-20 text-slate-600">
        Memuat Materi...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-slate-300 bg-white/80 backdrop-blur shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition"
          >
            <span className="text-lg">←</span>
            <span>{detail.course_name}</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">
          {detail.course_name}
        </h2>

        {/* LIST MODULE */}
        <section className="mb-6 grid gap-4 grid-cols-1">
          {detail.tutorials.map((tutorial) => (
            <div
              key={tutorial.tutorial_id}
              className="flex flex-col rounded-xl border border-slate-300 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-medium text-slate-700">
                  {tutorial.title}
                </span>

                {tutorial.status === "not_started" ? (
                  <button
                    className="bg-amber-500 hover:bg-amber-600 text-xs text-white px-3 py-1 rounded-full transition disabled:opacity-60"
                    disabled={loadingId === tutorial.tutorial_id}
                    onClick={() =>
                      handleMarkComplete(tutorial.tutorial_id)
                    }
                  >
                    {loadingId === tutorial.tutorial_id
                      ? "..."
                      : "Tandai Selesai"}
                  </button>
                ) : (
                  <span className="bg-green-600 text-xs text-white px-2 py-1 rounded-full">
                    Selesai
                  </span>
                )}
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* POPUP */}
      {popupState.visible && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center shadow-lg animate-fadeIn">
            <h3 className="text-xl font-bold text-green-600 mb-2">
              🎉 Selamat!
            </h3>
            <p className="text-slate-600 mb-5">
              Kamu telah menyelesaikan seluruh kelas ini
            </p>
            <button
              onClick={() =>
                setPopupState((s) => ({ ...s, visible: false }))
              }
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition text-white text-sm rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* POPUP ATURAN RUNTUT */}
      {rulePopup.visible && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center shadow-lg animate-fadeIn">
            <h3 className="text-lg font-bold text-amber-600 mb-2">
              Perhatian
            </h3>
            <p className="text-slate-600 mb-5">{rulePopup.message}</p>
            <button
              onClick={() =>
                setRulePopup((s) => ({ ...s, visible: false }))
              }
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 transition text-white text-sm rounded-lg"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
