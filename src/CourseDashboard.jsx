// C:\Users\User\project-capstone-dc05\src\CourseDashboard.jsx

export default function CourseDashboard({ course }) {
  const modules = [
    {
      id: 1,
      title: "Fundamental & Prasyarat",
      description:
        "Review konsep dasar yang wajib dikuasai sebelum masuk materi inti: logika pemrograman, matematika dasar, dan alat kerja utama.",
      estimated: "1–2 minggu",
    },
    {
      id: 2,
      title: "Core Skill & Tools",
      description:
        "Mendalami skill utama sesuai learning path: bahasa pemrograman, framework, tools, serta best practice di industri.",
      estimated: "3–6 minggu",
    },
    {
      id: 3,
      title: "Project & Portfolio",
      description:
        "Membangun 1–3 project akhir yang mencerminkan kebutuhan industri: end-to-end, bisa ditunjukkan sebagai portfolio.",
      estimated: "3–6 minggu",
    },
    {
      id: 4,
      title: "Assessment & Career Prep",
      description:
        "Latihan soal, simulasi interview, dan penyusunan CV/portfolio agar siap melamar kerja di role yang relevan.",
      estimated: "1–2 minggu",
    },
  ];

  // dummy progress (0–100) per modul
  const progressData = [
    { label: "M1", value: 10 },
    { label: "M2", value: 30 },
    { label: "M3", value: 55 },
    { label: "M4", value: 80 },
  ];

  const maxValue =
    progressData.length > 0
      ? Math.max(...progressData.map((d) => d.value))
      : 100;

  const chartWidth = 260;
  const chartHeight = 90;
  const paddingX = 10;
  const paddingY = 10;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  const points =
    progressData.length > 0
      ? progressData
          .map((d, index) => {
            const x =
              paddingX +
              (innerWidth *
                (progressData.length === 1 ? 0.5 : index)) /
                (progressData.length - 1 || 1);
            const y =
              paddingY +
              innerHeight -
              (innerHeight * d.value) / (maxValue || 1);
            return `${x},${y}`;
          })
          .join(" ")
      : "";

  return (
    <div className="space-y-8">
      {/* ROW UTAMA: kiri (header + fokus + rekomendasi) & kanan (progres penuh) */}
      <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.6fr)] items-stretch">
        {/* KOLom kiri */}
        <div className="space-y-6">
          {/* Header course */}
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
              Dashboard Course
            </p>
            <h1 className="text-3xl font-semibold text-slate-50 mb-2">
              {course.title}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl mb-3">
              Learning path ini dirancang untuk membawamu dari kondisi sekarang
              hingga siap bekerja sebagai{" "}
              <span className="font-semibold text-slate-100">
                {course.title}
              </span>
              . Ikuti modul secara berurutan dan tandai progresmu di setiap
              tahap.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1 text-slate-200">
                {course.level}
              </span>
              <span className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1 text-slate-200">
                Estimasi: {course.estimatedTime}
              </span>
            </div>
          </div>

          {/* Fokus Skill Utama */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <h2 className="text-sm font-semibold text-slate-50 mb-2">
              Fokus Skill Utama
            </h2>
            <p className="text-xs text-slate-300 mb-3">{course.focus}</p>
            <p className="text-[11px] text-slate-500">
              Kamu bisa mengembangkan daftar skill ini menjadi checklist detail,
              misalnya: tools spesifik, library, atau topik teori yang harus
              dikuasai.
            </p>
          </div>

          {/* Rekomendasi Alur Belajar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-xs text-slate-300">
            <h2 className="text-sm font-semibold text-slate-50 mb-2">
              Rekomendasi Alur Belajar
            </h2>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>Mulai dari fundamental &amp; prasyarat.</li>
              <li>Fokus di skill inti selama beberapa minggu.</li>
              <li>Bangun minimal 1–2 project portfolio.</li>
              <li>Lanjut ke latihan soal &amp; persiapan karier.</li>
            </ul>
          </div>
        </div>

        {/* KOLom kanan: Progres belajar (penuhi ruang kanan) */}
        <div className="w-full h-full rounded-2xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col">
          <p className="text-xs text-slate-400 mb-2">Progres Belajar</p>

          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-100 font-medium">0%</span>
            <span className="text-[11px] text-slate-500">
              0 dari {modules.length} modul selesai
            </span>
          </div>

          {/* Bar progres */}
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden mb-3">
            <div className="h-full w-0 bg-gradient-to-r from-sky-500 to-cyan-400 transition-[width] duration-700" />
          </div>

          {/* BAGIAN GRAFIK → flex-1 supaya ikut mengisi tinggi kartu */}
          <div className="mt-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] text-slate-400">
                Grafik progres per modul
              </p>
              <p className="text-[11px] text-slate-500">
                Nilai 0–100 (persen)
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-2 py-2 flex-1 flex flex-col">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full min-h-[6rem]"
              >
                {/* Background */}
                <rect
                  x="0"
                  y="0"
                  width={chartWidth}
                  height={chartHeight}
                  rx="10"
                  className="fill-slate-950"
                />

                {/* Grid */}
                {[0.25, 0.5, 0.75].map((ratio) => (
                  <line
                    key={ratio}
                    x1={paddingX}
                    x2={chartWidth - paddingX}
                    y1={paddingY + innerHeight * ratio}
                    y2={paddingY + innerHeight * ratio}
                    className="stroke-slate-800"
                    strokeWidth="0.5"
                    strokeDasharray="2 3"
                  />
                ))}

                {/* Area */}
                {points && (
                  <polyline
                    points={`${paddingX +
                      (innerWidth *
                        (progressData.length === 1 ? 0.5 : 0)) /
                        (progressData.length - 1 || 1)
                      },${paddingY + innerHeight} ${points} ${
                      paddingX +
                      (innerWidth *
                        (progressData.length === 1
                          ? 0.5
                          : progressData.length - 1)) /
                        (progressData.length - 1 || 1)
                    },${paddingY + innerHeight}`}
                    className="fill-cyan-500/10"
                  />
                )}

                {/* Line */}
                {points && (
                  <polyline
                    points={points}
                    className="stroke-cyan-400"
                    strokeWidth="2"
                    fill="none"
                  />
                )}

                {/* Dots */}
                {progressData.map((d, index) => {
                  const x =
                    paddingX +
                    (innerWidth *
                      (progressData.length === 1 ? 0.5 : index)) /
                      (progressData.length - 1 || 1);
                  const y =
                    paddingY +
                    innerHeight -
                    (innerHeight * d.value) / (maxValue || 1);

                  return (
                    <circle
                      key={d.label}
                      cx={x}
                      cy={y}
                      r="3"
                      className="fill-sky-400 stroke-slate-900"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Label X */}
                {progressData.map((d, index) => {
                  const x =
                    paddingX +
                    (innerWidth *
                      (progressData.length === 1 ? 0.5 : index)) /
                      (progressData.length - 1 || 1);
                  const y = chartHeight - 3;
                  return (
                    <text
                      key={d.label}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      className="fill-slate-500"
                      fontSize="8"
                    >
                      {d.label}
                    </text>
                  );
                })}
              </svg>

              <div className="mt-1 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  M1–M4 = Modul 1–4
                </span>
                <span className="text-[10px] text-cyan-400">
                  Garis = tren progres
                </span>
              </div>
            </div>

            <p className="mt-2 text-[11px] text-slate-500">
              Angka pada grafik ini masih contoh. Nantinya bisa diisi dari
              database (persentase kuis, tugas, atau modul yang sudah selesai).
            </p>
          </div>
        </div>
      </section>

      {/* Struktur modul */}
      <section>
        <h2 className="text-sm font-semibold text-slate-50 mb-3">
          Struktur Modul
        </h2>
        <div className="space-y-3">
          {modules.map((module, index) => (
            <div
              key={module.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-8 w-8 flex-shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-200">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-50">
                    {module.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {module.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-2 mt-2 md:mt-0">
                <span className="text-[11px] text-slate-400">
                  Estimasi: {module.estimated}
                </span>
                <button className="text-[11px] rounded-full border border-slate-700 px-3 py-1 text-slate-200 hover:bg-slate-800 transition">
                  Tandai selesai
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
