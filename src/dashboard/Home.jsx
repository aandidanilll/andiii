import React from "react";
import Header from "../components/Header";
import { useDashboardData } from "../hooks/useDashboardData";
import { useNavigate } from "react-router-dom";

export default function Home({ onLogout }) {
  const { user, learningPaths = [], loading } = useDashboardData();
  const navigate = useNavigate();

  const capitalizeName = (name) => {
    if (!name) return name;
    return String(name)
      .split(" ")
      .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
      .join(" ");
  };

  // Ambil nama dari metadata Supabase (fallback ke email username atau "Pengguna")
  const rawDisplayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.fullName ||
    (user?.email ? user.email.split("@")[0] : null) ||
    "Pengguna";

  const displayName = capitalizeName(rawDisplayName);

  // Ambil semua course dari semua learning path (aman jika learningPaths kosong)
  const allCourses = (learningPaths || []).flatMap((path) => path.courses || []);

  const getStatusText = (progress) => {
    if (progress === 100) return "Telah diselesaikan";
    if (progress === 0) return "Belum dipelajari";
    return "Sedang dipelajari";
  };

  const getStatusColor = (progress) => {
    if (progress === 100) return "text-green-600";
    if (progress === 0) return "text-gray-500";
    return "text-blue-600";
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-600 animate-pulse">
        Memuat data...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <Header
        displayName={displayName}
        onLogout={onLogout}
        dropdownOpen={false}
        setDropdownOpen={() => {}}
        user={user}
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white">
        <div className="flex flex-col items-center px-6 py-10 space-y-8">
          <h2 className="text-3xl font-semibold">
            Selamat datang, {displayName}!
          </h2>
          <p className="text-lg">Semoga aktivitas belajarmu menyenangkan.</p>

          {/* Card Course */}
          <div className="bg-white w-full max-w-4xl p-6 rounded-xl shadow-lg text-slate-800">
            <h3 className="font-semibold text-lg mb-6">Aktivitas Belajar</h3>

            {allCourses.length > 0 ? (
              <div className="space-y-3">
                {allCourses.map((course) => {
                  const progress = Number(course.progress_percent) || 0;
                  const statusText = getStatusText(progress);
                  const statusColor = getStatusColor(progress);

                  return (
                    <div
                      key={course.course_id}
                      className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-1 pr-4">
                        <p className="font-medium text-slate-800">{course.course_name}</p>

                        <p className={`text-xs mt-1 ${statusColor}`}>{statusText}</p>

                        <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              progress === 100 ? "bg-green-600" : progress === 0 ? "bg-gray-400" : "bg-blue-600"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        {course.enrollment_id ? (
                          <button
                            onClick={() => navigate(`/koridorkls/detail?enrollmentId=${course.enrollment_id}`)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold ${
                              progress === 100 ? "bg-green-600 text-white" : "bg-blue-600 text-white"
                            }`}
                          >
                            {progress === 100 ? "Selesai" : "Lanjutkan"}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-4 py-2 bg-gray-300 text-gray-500 text-xs rounded-lg cursor-not-allowed"
                          >
                            Terkunci
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-600">Tidak ada aktivitas belajar saat ini.</p>
            )}

            {/* TOMBOL KORIDOR KELAS */}
            {allCourses.length > 0 && (
              <div className="mt-8">
                <button
                  onClick={() => navigate(`/homeselengkapnya?enrollmentId=${allCourses[0].enrollment_id}`)}
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  selengkapnya
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
