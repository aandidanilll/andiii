import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useDashboardData } from "../hooks/useDashboardData";

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

/**
 * LevelBadge component
 */
function LevelBadge({ level }) {
  const classes = getLevelClasses(level);
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${classes}`}
      aria-label={`Level ${level || "Tidak ada level"}`}
    >
      {level || "Tidak ada level"}
    </span>
  );
}

function getLevelOrder(level) {
  if (!level) return 999;
  const key = String(level).trim().toLowerCase();
  switch (key) {
    case "dasar":
      return 0;
    case "pemula":
      return 1;
    case "menengah":
      return 2;
    case "mahir":
      return 3;
    case "profesional":
    case "professional":
      return 4;
    default:
      return 999;
  }
}

export default function Dashboard({ onLogout }) {
  const { user, learningPaths, loading } = useDashboardData();
  const navigate = useNavigate();

  const [selectedPath, setSelectedPath] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-600">
        Memuat Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      {/* HEADER */}
      <Header
        displayName={user?.name}
        onLogout={onLogout}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        user={user}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full px-4 py-6 md:px-8 md:py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-4">
            Dashboard Progres Belajar
          </h2>
          <p className="text-slate-600 text-sm mb-4">
            Silakan pilih Learning Path untuk melihat daftar course.
          </p>

          {/* TAB PATH */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-6 border-b border-slate-300">
            {learningPaths.map((path) => (
              <button
                key={path.path_id}
                onClick={() => setSelectedPath(path)}
                className={`
                  whitespace-nowrap px-4 py-2 rounded-full text-sm border transition flex-shrink-0
                  ${
                    selectedPath?.path_id === path.path_id
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white border-slate-300 text-slate-600 hover:bg-slate-200"
                  }
                `}
              >
                {path.path_name}
              </button>
            ))}
          </div>

          {!selectedPath && (
            <div className="text-slate-600 text-sm">
              Silakan pilih Learning Path untuk melihat daftar course.
            </div>
          )}

          {selectedPath && (
            <div className="mt-6 md:mt-8">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-1">
                {selectedPath.path_name}
              </h2>
              <p className="text-slate-600 mb-4 md:mb-6">
                Daftar course dalam alur belajar ini.
              </p>

              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {selectedPath.courses
                  .slice()
                  .sort((a, b) => {
                    const orderA = getLevelOrder(a?.level);
                    const orderB = getLevelOrder(b?.level);
                    if (orderA !== orderB) return orderA - orderB;
                    // jika sama urutan level, fallback ke nama course (alphabetical) untuk konsistensi
                    const nameA = (a.course_name || "").toLowerCase();
                    const nameB = (b.course_name || "").toLowerCase();
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
                    return 0;
                  })
                  .map((course) => (
                    <div
                      key={course.course_id}
                      className="relative border border-slate-200 bg-white rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition"
                    >
                      <h3 className="font-semibold text-slate-900 text-lg mb-2 min-h-[48px]">
                        {course.course_name}
                      </h3>

                      {/* Level badge (below course name) */}
                      <div className="mb-3">
                        <LevelBadge level={course.level} />
                      </div>

                      {course.enrollment_id ? (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-500">Progres</span>
                            <span className="text-xs text-blue-600 font-semibold">
                              {Number(course.progress_percent).toFixed(0)}%
                            </span>
                          </div>

                          <div className="h-2 w-full bg-slate-200 rounded-full mb-4 overflow-hidden">
                            <div
                              style={{ width: `${course.progress_percent}%` }}
                              className="h-full bg-blue-500"
                            />
                          </div>

                          <button
                            onClick={() =>
                              navigate(`/koridorkls?enrollmentId=${course.enrollment_id}`)
                            }
                            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                          >
                            Koridor Kelas
                          </button>
                        </>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2 rounded-lg border border-slate-300 text-slate-400 text-xs cursor-not-allowed"
                        >
                          Belum Diambil
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
