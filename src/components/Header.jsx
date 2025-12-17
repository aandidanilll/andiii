// src/components/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Header({ onLogout }) {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("Pengguna");
  const [dropdownOpen, setDropdownOpen] = useState(false); // profile dropdown
  const [academyOpen, setAcademyOpen] = useState(false); // NEW: academy dropdown (click only)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const academyRef = useRef(null);

    // ambil user dari localStorage saat mount
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
    try {
        const stored = localStorage.getItem("user_data");
        if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);

        const fullName =
            parsed?.user_metadata?.full_name ||
            parsed?.user_metadata?.fullName ||
            parsed?.email;

        if (fullName) setDisplayName(fullName);
        }
    } catch (err) {
        console.error("Gagal mengambil user_data dari localStorage", err);
    }
    }, []);

  // tutup dropdown / mobile menu / academy saat klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
      if (academyRef.current && !academyRef.current.contains(e.target)) {
        setAcademyOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // jika layar diubah ke md+, tutup mobile menu
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // keyboard handler untuk tombol dropdown (Enter / Space)
  const handleToggleAcademyKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setAcademyOpen((v) => !v);
    }
  };

  return (
    <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50 shadow-sm">
      <div className="max-w-full mx-auto flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        {/* Left: Logo + desktop nav */}
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <img src="/logo/dicoding-header-logo.png" alt="Logo" className="h-8" />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-6 items-center">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `text-sm ${
                  isActive
                    ? "text-blue-600 font-semibold border-b-4 border-blue-600 pb-2"
                    : "text-slate-600 hover:text-blue-600"
                } transition duration-300 cursor-pointer`
              }
            >
              Home
            </NavLink>

            {/* ACADEMY - DIJADIKAN DROPDOWN (click only) */}
            <div className="relative" ref={academyRef}>
              <button
                onClick={() => setAcademyOpen((v) => !v)}
                onKeyDown={handleToggleAcademyKey}
                aria-haspopup="true"
                aria-expanded={academyOpen}
                className={`text-sm ${
                  academyOpen ? "text-blue-600 font-semibold border-b-4 border-blue-600 pb-2" : "text-slate-600 hover:text-blue-600"
                } transition duration-300 cursor-pointer flex items-center gap-2`}
                type="button"
                title="Academy"
              >
                Academy
                <svg className="w-3 h-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 011.11 1.01l-4.25 4.656a.75.75 0 01-1.11 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Dropdown panel (visible only when academyOpen true) */}
              {academyOpen && (
                <div className="absolute left-0 mt-3 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-40">
                  <nav className="flex flex-col py-2">
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        `px-3 py-2 text-sm ${isActive ? "text-blue-600 font-semibold bg-blue-50" : "text-slate-700 hover:bg-slate-50"}`
                      }
                    >
                      Progress Belajar
                    </NavLink>

                    <NavLink
                      to="/runtutan"
                      className={({ isActive }) =>
                        `px-3 py-2 text-sm ${isActive ? "text-blue-600 font-semibold bg-blue-50" : "text-slate-700 hover:bg-slate-50"}`
                      }
                    >
                      Runtutan Belajar
                    </NavLink>
                  </nav>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right: user + mobile menu button */}
        <div className="flex items-center gap-3">
          {/* mobile hamburger */}
          <div className="md:hidden flex items-center" ref={mobileMenuRef}>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-expanded={mobileMenuOpen}
              aria-label="Buka menu"
              className="p-2 rounded-md hover:bg-slate-100"
            >
              {/* simple hamburger icon */}
              <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* user info (hidden on very small screens) */}
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-500">Masuk sebagai</p>
            <p className="text-sm font-medium text-slate-700 truncate max-w-[160px]">{displayName}</p>
          </div>

          {/* profile button + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="rounded-full h-8 w-8 bg-slate-200 overflow-hidden"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <img
                src={user?.profile_picture || "/logo/profile-kosong.jpg"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-40">
                <div className="px-3 py-2 text-sm text-slate-700">
                  <div className="mb-2">
                    <div className="text-xs text-slate-500">Masuk sebagai</div>
                    <div className="font-medium truncate">{displayName}</div>
                  </div>
                  <hr className="border-slate-200 my-2" />
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout && onLogout();
                    }}
                    className="w-full text-left text-red-500 hover:bg-slate-50 px-2 py-2 rounded"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu panel (full width dropdown under header) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <NavLink
              onClick={() => setMobileMenuOpen(false)}
              to="/home"
              className={({ isActive }) =>
                `block text-sm px-3 py-2 rounded ${isActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-700 hover:bg-slate-50"}`
              }
            >
              Home
            </NavLink>

            {/* Mobile: Academy expanded as submenu */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-sm font-medium text-slate-700">Academy</div>
              <NavLink
                onClick={() => setMobileMenuOpen(false)}
                to="/dashboard"
                className={({ isActive }) =>
                  `block text-sm px-3 py-2 rounded pl-6 ${isActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-700 hover:bg-slate-50"}`
                }
              >
                Progress Belajar
              </NavLink>
              <NavLink
                onClick={() => setMobileMenuOpen(false)}
                to="/runtutan"
                className={({ isActive }) =>
                  `block text-sm px-3 py-2 rounded pl-6 ${isActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-700 hover:bg-slate-50"}`
                }
              >
                Runtutan Belajar
              </NavLink>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout && onLogout();
                }}
                className="w-full text-left text-sm text-red-500 px-3 py-2 rounded hover:bg-slate-50"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
