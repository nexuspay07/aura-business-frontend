import { BarChart3, LayoutDashboard, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const links = [["/admin", LayoutDashboard, "Overview", true], ["/admin/users", Users, "Users"], ["/admin/intelligence", BarChart3, "Intelligence"]];

export default function ControlCenterLayout() {
  return <div className="aevric-shell control-center-shell min-h-screen lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
    <aside className="aevric-sidebar border-b lg:min-h-screen lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-5 py-5 lg:block lg:px-6 lg:py-8"><div><p className="text-lg font-semibold tracking-[.16em] text-white">AEVRIC</p><p className="mt-1 text-xs uppercase tracking-[.14em] text-slate-500">Control Center</p></div>
      <nav aria-label="Control Center navigation" className="flex gap-1 lg:mt-10 lg:block lg:space-y-1">{links.map(([to, Icon, label, end]) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${isActive ? "bg-blue-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon size={17}/><span className="hidden sm:inline">{label}</span></NavLink>)}</nav></div>
    </aside>
    <main className="min-w-0 px-4 py-7 sm:px-7 lg:px-10 lg:py-10"><div className="mx-auto max-w-7xl"><Outlet/></div></main>
  </div>;
}
