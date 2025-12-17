// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  HiOutlineBookOpen,
  HiOutlineClipboardList,
  HiX,
} from "react-icons/hi";

/**
 * MenuItem: deklarasi OUTSIDE Sidebar supaya tidak diciptakan ulang setiap render.
 * Props:
 *  - to: path
 *  - IconComponent: komponen ikon
 *  - label: teks menu
 *  - collapsed: boolean, jika true maka hanya tampil ikon (label disembunyikan)
 */
/* eslint-disable no-unused-vars */
function MenuItem({ to, IconComponent, label, collapsed }) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 text-sm px-3 py-2 rounded-md transition-colors duration-200
         ${
           isActive
             ? "font-semibold text-blue-600 bg-blue-50"
             : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
         }`
      }
    >
      <IconComponent className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}
/* eslint-enable no-unused-vars */


export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const collapsed = !sidebarOpen; // collapsed ketika sidebarOpen false (desktop)
  const rootClass = `${
    sidebarOpen ? "md:w-64" : "md:w-20"
  } w-full relative flex flex-col h-full bg-white border-r border-slate-200 shadow-sm transition-all duration-300 p-4`;

  return (
    <aside className={rootClass}>
      {/* Header area: logo + tombol */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        {sidebarOpen ? (
          <div className="flex items-center gap-3">
            <img
              src="/logo/academy-logo.png"
              alt="Academy"
              className="w-36 h-auto object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-8 h-8">
            <img
              src="/logo/academy-logo.png"
              alt="A"
              className="w-6 h-6 object-contain"
            />
          </div>
        )}

        {/* Close (mobile) */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-100"
          aria-label="Tutup sidebar"
          onClick={() => setSidebarOpen(false)}
        >
          <HiX className="w-5 h-5" />
        </button>

        {/* Collapse / Expand desktop */}
        <button
          className="hidden md:inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-100"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span className="text-slate-600 select-none">
            {sidebarOpen ? "⟨⟨" : "⟩⟩"}
          </span>
        </button>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-1">
        <MenuItem
          to="/dashboard"
          IconComponent={HiOutlineBookOpen}
          label="Progress Belajar"
          collapsed={collapsed}
        />
        <MenuItem
          to="/runtutan"
          IconComponent={HiOutlineClipboardList}
          label="Runtutan Belajar"
          collapsed={collapsed}
        />
        <MenuItem
          to="/subscription"
          IconComponent={HiOutlineClipboardList}
          label="Langganan"
          collapsed={collapsed}
        />
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4">
        {sidebarOpen ? (
          <div className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Dicoding Academy
          </div>
        ) : (
          <div className="text-center text-xs text-slate-400">
            ©{new Date().getFullYear()}
          </div>
        )}
      </div>
    </aside>
  );
}
