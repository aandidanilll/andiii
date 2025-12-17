import React, { useState } from "react";
import Header from "../components/Header";
import { useActivitySummary } from "../hooks/useActivitySummary";
import { useDashboardData } from "../hooks/useDashboardData";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Runtutan = ({onLogout }) => {
  const [selectedPath, setSelectedPath] = useState(null);
  const { summary, activity } = useActivitySummary();
  const { learningPaths, loading: loadingLP, user } = useDashboardData();

  const chartData = {
    labels: activity?.chart_data?.map((item) => item.date) || [],
    datasets: [
      {
        label: "Menit Belajar",
        data: activity?.chart_data?.map((item) => item.minutes) || [],
        backgroundColor: "rgba(74, 222, 128, 0.25)",
        borderColor: "#16a34a",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { color: "#e5e7eb" },
      },
    },
  };

  const handlePathChange = (event) => {
    setSelectedPath(event.target.value);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      {/* Header */}
      <Header
        displayName={user?.name}
        onLogout={onLogout}
        dropdownOpen={false}
        setDropdownOpen={() => {}}
        user={user}
      />

      <main className="flex-1 p-6 space-y-6">
        {/* Aktivitas Belajar */}
        <div className="bg-white shadow-sm rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-1 flex items-center gap-2">
            Aktivitas Belajar
          </h2>
          <p className="text-sm text-slate-500 mb-4">Aktivitas Belajar Siswa</p>

          {/* Summary atas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div>
              <h3 className="text-3xl font-bold text-slate-700">
                {activity?.minutes_this_week || 0} Menit
              </h3>
              <p className="text-sm text-green-600 font-medium mt-1">
                ↑ {activity?.percentage_change || 0}%
              </p>
              <p className="text-xs text-slate-500">
                Perbandingan dengan minggu lalu
              </p>
            </div>

            <div className="h-28 md:col-span-2 bg-white">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Summary bawah */}
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 text-sm">
              <div>
                <p className="text-slate-500">Courses</p>
                <p className="text-lg font-semibold">
                  {summary.total_courses}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Learning Hours</p>
                <p className="text-lg font-semibold flex items-center gap-1">
                  {summary.learning_hours}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Assessments</p>
                <p className="text-lg font-semibold">
                  {summary.total_assessments}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Submission</p>
                <p className="text-lg font-semibold">
                  {summary.total_submissions}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Learning Path Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold">
              Progres Kelas Learning Path
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Ringkasan progres belajar kamu berdasarkan Learning Path
            </p>

            {/* Loading state */}
            {loadingLP && (
              <p className="text-sm text-slate-500">Memuat data...</p>
            )}

            {/* Jika tidak ada path */}
            {!loadingLP && learningPaths.length === 0 && (
              <p className="text-sm text-slate-500">
                Belum ada Learning Path yang diikuti.
              </p>
            )}

            {/* Dropdown untuk memilih Learning Path */}
            {!loadingLP && learningPaths.length > 0 && (
              <div className="mb-4">
                <label className="text-sm text-slate-600">
                  Pilih Learning Path:
                </label>
                <select
                  value={selectedPath || ""}
                  onChange={handlePathChange}
                  className="block w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Learning Path</option>
                  {learningPaths.map((path) => (
                    <option key={path.path_id} value={path.path_id}>
                      {path.path_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Render selected Learning Path */}
            {selectedPath &&
              !loadingLP &&
              learningPaths.map((path) => {
                if (path.path_id === selectedPath) {
                  return (
                    <div key={path.path_id}>
                      <p className="font-medium text-slate-700">
                        {path.path_name}
                      </p>

                      <div className="w-full bg-slate-200 h-2 rounded-full mt-2">
                        <div
                          className="h-2 bg-green-500 rounded-full"
                          style={{
                            width: `${path.path_progress_percent}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-right text-xs text-slate-500 mt-1">
                        {path.path_progress_percent}% / 100%
                      </p>

                      <div className="space-y-3 border-l pl-4 border-slate-300 mt-3">
                        {path.courses
                          .sort((a, b) => a.order - b.order)
                          .map((course) => (
                            <div key={course.course_id}>
                              <p className="text-sm">{course.course_name}</p>
                              <div className="w-full bg-slate-200 h-2 rounded-full">
                                <div
                                  className="h-2 bg-green-500 rounded-full"
                                  style={{
                                    width: `${course.progress_percent}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
          </div>

          {/* Deskripsi Grafik Aktivitas Belajar */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold">
              Deskripsi Grafik Aktivitas Belajar
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Grafik ini menunjukkan total menit yang dihabiskan untuk belajar
              selama minggu ini. Perbandingan minggu ini dengan minggu lalu
              sebesar {activity?.percentage_change || 0}%.
            </p>
            <p className="text-sm text-slate-500">
              Aktivitas ini diukur berdasarkan waktu yang digunakan dalam setiap
              sesi pembelajaran. Semakin tinggi aktivitas, semakin banyak waktu
              yang dihabiskan untuk belajar.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Runtutan;
