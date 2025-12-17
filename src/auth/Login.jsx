import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Login({ onLogin }) {
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    login(form.email, form.password, onLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />

          <div className="px-8 py-8">
            <div className="mb-6">
              <img src="/logo/dicoding-header-logo.png" alt="Dicoding" className="h-8 mb-3" />
              <h1 className="text-2xl font-semibold text-slate-900">Selamat datang</h1>
              <p className="text-sm text-slate-500 mt-1">Masuk untuk mengakses progres belajar kamu.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* EMAIL */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white text-slate-800 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan Email"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white text-slate-800 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan password"
                    required
                    aria-describedby="show-password"
                  />

                  {/* Tombol icon mata */}
                  <button
                    id="show-password"
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition"
                    aria-pressed={showPassword}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      /* Eye Off */
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.583 10.587A3 3 0 0113.41 13.41" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.343 6.343A9.958 9.958 0 003 12c1.5 3.5 4.5 6 9 6 1.57 0 3.07-.3 4.41-.84" />
                      </svg>
                    ) : (
                      /* Eye */
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                disabled={loading}
                type="submit"
                className="w-full mt-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 transition shadow-sm disabled:opacity-60"
              >
                {loading ? "Memuat..." : "Masuk"}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              Dengan masuk, kamu setuju dengan <span className="text-slate-700">Syarat & Ketentuan</span> kami.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
