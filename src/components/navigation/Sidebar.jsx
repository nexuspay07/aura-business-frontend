import { BrainCircuit, Building2, LayoutDashboard, LogOut, PanelLeftClose, Sparkles, PanelsTopLeft } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { title: "Home", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Decision Center", icon: BrainCircuit, path: "/intelligence" },
  { title: "Saved Sessions", icon: Sparkles, path: "/sessions" },
  { title: "Organizations", icon: Building2, path: "/organizations" },
  { title: "Workspaces", icon: PanelsTopLeft, path: "/workspaces" },
];

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const closeButton = useRef(null);
  const signOut = () => { logout(); onClose(); navigate("/login", { replace: true }); };

  useLayoutEffect(() => {
    if (!mobileOpen) return undefined;
    const focusFrame = requestAnimationFrame(() => closeButton.current?.focus());
    const closeOnEscape = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => { cancelAnimationFrame(focusFrame); window.removeEventListener("keydown", closeOnEscape); };
  }, [mobileOpen, onClose]);

  return <>
    {mobileOpen && <button aria-label="Close navigation overlay" onClick={onClose} className="fixed inset-0 z-30 bg-black/60 lg:hidden" />}
    <aside aria-label="Primary navigation" className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-[#0b0e14] text-slate-200 shadow-2xl transition-transform duration-200 lg:static lg:translate-x-0 lg:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-6"><div><h1 className="text-xl font-bold tracking-tight text-white">Aura <span className="text-slate-500">OS</span></h1><p className="mt-1 text-xs text-slate-500">Intelligence operating system</p></div>{mobileOpen && <button ref={closeButton} aria-label="Close navigation" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"><PanelLeftClose size={18}/></button>}</div>
      <nav className="flex-1 px-4 py-6"><p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[.14em] text-slate-600">Operate</p><div className="space-y-1">{menuItems.map(({ title, icon: Icon, path }) => <NavLink key={path} to={path} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon size={18}/>{title}</NavLink>)}</div></nav>
      <div className="border-t border-white/10 p-4"><button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"><LogOut size={17}/>Logout</button></div>
    </aside>
  </>;
}
