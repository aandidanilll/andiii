import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCourseDetail } from "../hooks/useCourseDetail";
import "react-circular-progressbar/dist/styles.css";
import { Bar, Pie } from "react-chartjs-2";
import { useDashboardData } from "../hooks/useDashboardData";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import Header from "../components/Header";
import { useRekomendasi } from "../hooks/useRekomendasi";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

/**
 * Helper: kembalikan class Tailwind untuk tiap level (case-insensitive)
 */
function getLevelClasses(level) {
  if (!level) return "bg-slate-100 text-slate-700";
  const key = String(level).trim().toLowerCase();
  switch (key) {
    case "dasar":
      return "bg-slate-100 text-slate-700";
    case "pemula":
      return "bg-blue-100 text-blue-700";
    case "menengah":
      return "bg-amber-100 text-amber-700";
    case "mahir":
      return "bg-indigo-100 text-indigo-700";
    case "profesional":
    case "professional":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

// Inline SVG icons (calendar + clock) — decorative (aria-hidden)
const CalendarIcon = ({ className = "inline-block mr-2", size = 16 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M7 11H9V13H7V11Z" fill="currentColor" />
    <path d="M11 11H13V13H11V11Z" fill="currentColor" />
    <path d="M15 11H17V13H15V11Z" fill="currentColor" />
    <path
      d="M7 3V4H5C3.89543 4 3 4.89543 3 6V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V6C21 4.89543 20.1046 4 19 4H17V3H15V4H9V3H7ZM19 9H5V6H19V9Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * LevelBadge component
 */
function LevelBadge({ level }) {
  const classes = getLevelClasses(level);
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${classes}`}>
      {level || "Tidak ada level"}
    </span>
  );
}

/**
 * RecommendationSlider
 */
function RecommendationSlider({
  rekomendasi = [],
  detail = {},
  navigate,
  loadingRekom = false,
  errorRekom = false,
}) {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateButtonState = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth + 5 < el.scrollWidth);
  };

  useEffect(() => {
    updateButtonState();
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtonState, { passive: true });
    window.addEventListener("resize", updateButtonState);
    return () => {
      el.removeEventListener("scroll", updateButtonState);
      window.removeEventListener("resize", updateButtonState);
    };
  }, [rekomendasi]);

  const handleScroll = (dir = "right") => {
    const el = containerRef.current;
    if (!el) return;
    const step = Math.round(el.clientWidth * 0.8);
    const target = dir === "right" ? el.scrollLeft + step : el.scrollLeft - step;
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <div className="relative mt-4">
      {!loadingRekom && !errorRekom && (
        <>
          {/* Left arrow (desktop) */}
          <button
            aria-label="Scroll left"
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            className={`hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full shadow-sm focus:outline-none
              ${canScrollLeft ? "bg-white/90 hover:bg-white" : "bg-white/70 opacity-40 cursor-not-allowed"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Slider */}
          <div
            ref={containerRef}
            role="list"
            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 py-2 px-4 md:px-8"
          >
            {rekomendasi
              .filter((item) => item.learning_path !== detail.course_name)
              .map((item, index) => (
                <article
                  key={index}
                  role="listitem"
                  className="snap-start min-w-[230px] md:min-w-[300px] lg:min-w-[320px] border border-slate-100 rounded-xl p-4 bg-slate-50 flex-shrink-0"
                >
                  <h3 className="font-medium text-slate-800">{item.course_name}</h3>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-slate-500">Level:</span>
                    <LevelBadge level={item.level} />
                  </div>

                  <p className="text-sm text-slate-500 mt-2 line-clamp-3">
                    {item.description ||
                      "Pelajari modul ini untuk memperdalam kemampuanmu. Klik Mulai Modul untuk melihat detail."}
                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        `/koridorkls/detail?tutorialId=${item.next_step?.tutorial_id}&enrollmentId=${item.enrollment_id}`
                      )
                    }
                    className="mt-3 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Mulai Modul
                  </button>
                </article>
              ))}
          </div>

          {/* Right arrow (desktop) */}
          <button
            aria-label="Scroll right"
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            className={`hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full shadow-sm focus:outline-none
              ${canScrollRight ? "bg-white/90 hover:bg-white" : "bg-white/70 opacity-40 cursor-not-allowed"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Mobile controls (small buttons) */}
          <div className="flex gap-2 mt-3 md:hidden justify-center">
            <button
              aria-label="Prev"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              className={`px-3 py-1 rounded-lg text-sm font-medium border ${canScrollLeft ? "bg-white" : "opacity-40 cursor-not-allowed"}`}
            >
              ◀
            </button>
            <button
              aria-label="Next"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              className={`px-3 py-1 rounded-lg text-sm font-medium border ${canScrollRight ? "bg-white" : "opacity-40 cursor-not-allowed"}`}
            >
              ▶
            </button>
          </div>
        </>
      )}

      {loadingRekom && <p className="text-sm text-slate-500">Memuat rekomendasi...</p>}
      {errorRekom && <p className="text-sm text-red-500">Terjadi kesalahan: {errorRekom}</p>}
    </div>
  );
}

export default function DashboardDetail({ user, onLogout }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const enrollmentId = searchParams.get("enrollmentId");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { detail, loading } = useCourseDetail(enrollmentId);
  const { learningPaths } = useDashboardData();

  const {
    data: rekomendasi,
    loading: loadingRekom,
    error: errorRekom,
  } = useRekomendasi();

  const [hoverProgress, setHoverProgress] = useState(false);
  const milestones = [25, 50, 75, 100];

  if (loading || !detail) {
    return (
      <div className="text-center py-20 text-slate-600 animate-pulse">
        Memuat Materi...
      </div>
    );
  }

  const total = detail.tutorials.length;
  const completed = detail.tutorials.filter((t) => t.status === "completed").length;

  // progressPercent sebagai number bulat antara 0-100
  const progressPercent = total === 0 ? 0 : (completed / total) * 100;
  const progressRounded = Math.round(progressPercent);
  const remaining = 100 - progressRounded;

  // ambil deadline dari dashboard berdasarkan enrollmentId
  const deadline =
    learningPaths
      ?.flatMap((path) => path.courses)
      ?.find((course) => course.enrollment_id === enrollmentId)
      ?.deadline || "-";

  // getProgressColor sesuai ketentuan
  const getProgressColor = (progress, deadlineValue) => {
    const GREEN = "#16a34a";
    const RED = "#b52d2dff";
    const YELLOW = "#fbbf24";
    const BLUE = "#3b82f6";

    const prog = typeof progress === "number" ? Math.round(progress) : Number(progress);

    if (prog === 100) return GREEN;
    if (prog === 0 || !deadlineValue || deadlineValue === "-") return BLUE;

    const now = new Date();
    const deadlineDate = new Date(deadlineValue);

    if (isNaN(deadlineDate.getTime())) return BLUE;

    const diffMs = deadlineDate - now;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return RED;
    if (diffDays <= 3) return YELLOW;
    return BLUE;
  };

  const progressColor = getProgressColor(progressRounded, deadline);

  const cardStyle = "bg-white rounded-2xl p-6 shadow-sm border border-slate-100";

  const formatTanggal = (dateStr) => {
    if (!dateStr || dateStr === "-") return "-";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";

    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    return date.toLocaleDateString("id-ID", options);
  };

  const getDeadlineStatusText = (deadlineValue, progress, tutorials = []) => {
    if (!deadlineValue || deadlineValue === "-") return "Tidak ada deadline";

    const dl = new Date(deadlineValue);
    if (isNaN(dl.getTime())) return "Deadline tidak valid";

    const daysDiff = (fromDate, toDate) => {
      const diffMs = toDate - fromDate;
      return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    };

    if (Number(progress) === 100) {
      const completedWithDate = (tutorials || []).filter(
        (t) =>
          t?.status === "completed" &&
          (t?.completed_at || t?.finished_at || t?.completedAt)
      );

      if (completedWithDate.length > 0) {
        const latest = completedWithDate.reduce((a, b) => {
          const aDate = new Date(a.completed_at || a.finished_at || a.completedAt);
          const bDate = new Date(b.completed_at || b.finished_at || b.completedAt);
          return aDate > bDate ? a : b;
        });

        const completionDate = new Date(
          latest.completed_at || latest.finished_at || latest.completedAt
        );
        if (isNaN(completionDate.getTime())) {
          return "Kamu telah menyelesaikan kelas ini.";
        }

        const diff = daysDiff(completionDate, dl);
        if (diff > 0) {
          return `Kamu telah menyelesaikan kelas ini ${diff} hari sebelum deadline.`;
        } else if (diff === 0) {
          return `Kamu telah menyelesaikan kelas ini tepat pada tanggal deadline.`;
        } else {
          return `Kamu telah menyelesaikan kelas ini, tetapi melewati ${Math.abs(diff)} hari dari tanggal deadline.`;
        }
      }

      return "Kamu telah menyelesaikan kelas ini.";
    }

    const now = new Date();
    const diffMs = dl - now;
    const diffDaysFloat = diffMs / (1000 * 60 * 60 * 24);
    const diffDays = Math.ceil(diffDaysFloat);

    if (diffDaysFloat < 0) {
      return `Telah lewat (${Math.abs(diffDays)} hari lalu)`;
    }

    if (diffDaysFloat <= 3) {
      return `Deadline dekat: ${diffDays} hari`;
    }

    return `Deadline: ${formatTanggal(deadlineValue)}`;
  };

  const deadlineStatusText = getDeadlineStatusText(deadline, progressRounded, detail?.tutorials);

  const rekomUntukEnrollment = Array.isArray(rekomendasi)
    ? rekomendasi.filter((r) => r.enrollment_id === detail.enrollment_id)
    : [];

  const ClockIcon = ({ className = "inline-block mr-2", size = 14 }) => (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 1.75C6.213 1.75 1.75 6.213 1.75 12C1.75 17.787 6.213 22.25 12 22.25C17.787 22.25 22.25 17.787 22.25 12C22.25 6.213 17.787 1.75 12 1.75ZM12 20.75C7.167 20.75 3.25 16.833 3.25 12C3.25 7.167 7.167 3.25 12 3.25C16.833 3.25 20.75 7.167 20.75 12C20.75 16.833 16.833 20.75 12 20.75Z"
        fill="currentColor"
      />
      <path d="M12.75 7H11.25V12.25L15.5 14.55L16.25 13.26L12.75 11.64V7Z" fill="currentColor" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Header */}
      <Header
        displayName={user?.name}
        onLogout={onLogout}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        user={user}
      />

      {/* Main Content (no Sidebar) */}
      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 pt-3 pb-1">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition"
          >
            <span className="text-base sm:text-lg">←</span>
            <span className="truncate max-w-[160px] sm:max-w-none">
              Koridor Kelas
            </span>
          </button>
        </div>

        <main className="max-w-5xl mx-auto px-4 md:px-6 pt-2 pb-6 space-y-4">
          {/* Title + Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              {detail.course_name}
            </h2>

            <button
              onClick={() =>
                navigate(`/koridorkls/detail?enrollmentId=${detail.enrollment_id}`)
              }
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-white text-sm font-semibold shadow-sm"
            >
              {progressRounded === 100
                ? "Belajar Lagi"
                : progressRounded === 0
                ? "Mulai Belajar"
                : "Lanjut Belajar"}
            </button>
          </div>

          {/* Progress Section */}
          <div className={cardStyle}>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Progress Belajar</h3>

            {/* Badge & Deadline */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full tracking-wide ${
                  progressRounded === 0
                    ? "text-red-600 bg-red-100"
                    : progressRounded === 100
                    ? "text-green-600 bg-green-100"
                    : "text-blue-600 bg-blue-100"
                }`}
              >
                {progressRounded}%{" "}
                {progressRounded === 0
                  ? "Belum Dimulai"
                  : progressRounded === 100
                  ? "Selesai"
                  : "Sedang Dipelajari"}
              </span>

              <span className="text-sm text-slate-500 flex items-center">
                <CalendarIcon className="inline-block mr-2 text-slate-400" size={16} />
                Deadline:
                <span className="font-semibold text-slate-700 ml-2">
                  {formatTanggal(deadline)}
                </span>
              </span>
            </div>

            {/* Progress Bar with hover tooltip + milestones */}
            <div
              className="relative"
              onMouseEnter={() => setHoverProgress(true)}
              onMouseLeave={() => setHoverProgress(false)}
              aria-describedby="deadline-status"
            >
              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-5 relative">
                <div
                  style={{
                    width: `${progressRounded}%`,
                    backgroundColor: progressColor,
                  }}
                  className="h-3 rounded-full transition-all duration-500"
                />

                
                {milestones.map((m) => {
                  const passed = progressRounded >= m;
                  return (
                    <div
                      key={m}
                      className="absolute inset-y-0 group"
                      style={{ left: `${m}%` }}
                    >
                      {/* garis di bar */}
                      <div className="relative h-full">
                        <div
                          className={`w-[2px] h-full mx-auto ${
                            passed ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        />
                      </div>

                      {/* angka persen */}
                      <div
                        className={`
                          absolute -top-1.5 left-1/2 -translate-x-1/2 translate-y-1
                          text-[10px] font-semibold
                          ${passed ? "text-emerald-900" : "text-slate-500"}
                          /* mobile: selalu terlihat, desktop: jadi tooltip hover */
                          md:opacity-0 md:group-hover:opacity-100 md:bg-slate-800 md:text-white
                          md:px-1.5 md:py-0.5 md:rounded md:transition-opacity md:pointer-events-none
                        `}
                      >
                        {m}%
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tooltip di atas ujung progress */}
              <div
                id="deadline-status"
                className={`absolute -top-10 md:-top-9 px-2 md:px-3 py-1.5 md:py-2
                  text-[10px] md:text-xs rounded shadow-md whitespace-nowrap z-20
                  transition-opacity duration-150
                  ${hoverProgress ? "opacity-100 visible" : "opacity-0 invisible"}`}
                style={{
                  left: `${progressRounded}%`,
                  transform: "translateX(-50%)",
                  ...(progressRounded < 1 && {
                    left: "1%",
                    transform: "translateX(0)",
                  }),
                  ...(progressRounded > 99 && {
                    left: "99%",
                    transform: "translateX(-100%)",
                  }),
                  background: progressColor,
                  color: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                {deadlineStatusText}
                <div
                  className="absolute w-0 h-0 -bottom-1 md:-bottom-1.5"
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: `5px solid ${progressColor}`,
                  }}
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1 text-sm text-slate-600">
              {progressRounded === 100 ? (
                <p className="font-medium text-green-600">
                  🎉 Selamat! Kamu telah menyelesaikan seluruh modul.
                </p>
              ) : progressRounded === 0 ? (
                <p>Kamu belum memulai modul. Yuk mulai belajar sekarang!</p>
              ) : (
                <p>
                  Kamu sudah menyelesaikan{" "}
                  <span className="font-semibold">{progressRounded}%</span> dari
                  keseluruhan materi.
                </p>
              )}

              {progressRounded !== 100 && (
                <p>
                  Masih tersisa{" "}
                  <span className="font-semibold">{remaining}%</span> modul yang
                  harus diselesaikan. Semangat! 💪
                </p>
              )}
            </div>
          </div>

          {/* Rekomendasi dari API */}
          <div className={cardStyle}>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Rekomendasi Belajar
            </h3>

            {loadingRekom && (
              <p className="text-sm text-slate-500">Memuat rekomendasi...</p>
            )}

            {errorRekom && (
              <p className="text-sm text-red-500">
                Terjadi kesalahan: {errorRekom}
              </p>
            )}

            {!loadingRekom && !errorRekom && rekomendasi.length === 0 && (
              <p className="text-sm text-slate-500">
                Tidak ada rekomendasi saat ini.
              </p>
            )}

            {!loadingRekom && !errorRekom && rekomendasi.length > 0 && (
              <>
                {rekomUntukEnrollment.length > 0
                  ? rekomUntukEnrollment.map((item, index) => (
                      <div
                        key={index}
                        className="border border-slate-100 rounded-xl p-4 mb-3 bg-slate-50"
                      >
                        <p className="text-sm text-slate-500">
                          Agar pembelajaran semakin optimal, silakan lanjutkan ke
                          materi
                        </p>
                        <p className="font-medium text-blue-600">
                          {item.next_step?.title || "Tidak ada langkah lanjutan"}
                        </p>

                        {item.next_step?.tutorial_id ? (
                          <button
                            onClick={() =>
                              navigate(
                                `/koridorkls/detail?tutorialId=${item.next_step.tutorial_id}&enrollmentId=${item.enrollment_id}`
                              )
                            }
                            className="mt-3 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
                          >
                            Mulai Modul
                          </button>
                        ) : (
                          <p className="mt-3 text-xs text-slate-500">
                            Tidak ada modul berikutnya yang dapat dimulai.
                          </p>
                        )}
                      </div>
                    ))
                  : null}
              </>
            )}

            {progressRounded === 100 && (
              <RecommendationSlider
                rekomendasi={rekomendasi}
                detail={detail}
                navigate={navigate}
                loadingRekom={loadingRekom}
                errorRekom={errorRekom}
              />
            )}
          </div>

          {/* Forum & Mentoring */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={cardStyle}>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                Forum Diskusi
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Berdiskusi dengan para expert, alumni, atau siswa lainnya.
              </p>
              <button
                onClick={() =>
                  window.open(
                    "https://www.dicoding.com/academies/237/discussions",
                    "_blank"
                  )
                }
                className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 transition text-white text-sm rounded-xl shadow-sm"
              >
                Ke Forum Diskusi
              </button>
            </div>
            <div className={cardStyle}>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                Mentoring Platform
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Konsultasi langsung dengan mentor untuk membantu proses belajarmu.
              </p>
              <button
                onClick={() =>
                  window.open("https://www.dicoding.com/mentoring", "_blank")
                }
                className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 transition text-white text-sm rounded-xl shadow-sm"
              >
                Ke Mentoring Platform
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
