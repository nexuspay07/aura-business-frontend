import {
  LayoutDashboard,
  BrainCircuit,
  Store,
  Building2,
  FolderTree,
  BarChart3,
  BookOpen,
  Database,
  Settings,
  Sparkles,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

const menuItems = [

  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },

  {
    title: "Intelligence",
    icon: BrainCircuit,
    path: "/intelligence",
  },

  {
    title: "Marketplace",
    icon: Store,
    path: "/marketplace",
  },

  {
    title: "Organization",
    icon: Building2,
    path: "/organization",
  },

  {
    title: "Workspaces",
    icon: FolderTree,
    path: "/workspaces",
  },

  {
    title: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },

  {
    title: "Knowledge",
    icon: BookOpen,
    path: "/knowledge",
  },

  {
    title: "Memory",
    icon: Database,
    path: "/memory",
  },

  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },

];

export default function Sidebar() {

  const navigate = useNavigate();

  return (

    <aside className="w-72 h-screen bg-white border-r border-slate-200 flex flex-col">

      {/* Logo */}

      <div className="px-8 py-8 border-b border-slate-100">

        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          AURA
        </h1>

        <p className="text-blue-600 font-light text-xl">
          Business
        </p>

        <p className="text-xs text-slate-500 mt-2">

          Enterprise Intelligence Platform

        </p>

      </div>

      {/* Navigation */}

      <div className="flex-1 overflow-auto px-5 py-6">

        <div className="space-y-2">

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (

              <NavLink

                key={item.path}

                to={item.path}

                className={({ isActive }) =>

                  `flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-blue-500 text-white shadow-lg"
                      : "text-slate-700 hover:bg-slate-100"
                  }`

                }

              >

                <Icon size={20} />

                <span className="font-medium">

                  {item.title}

                </span>

              </NavLink>

            );

          })}

        </div>

      </div>

      {/* Quick Action */}

      <div className="px-5">

        <button

          onClick={() => navigate("/intelligence")}

          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 text-white py-3 flex items-center justify-center gap-2 font-semibold hover:scale-[1.02] transition"

        >

          <Sparkles size={18} />

          Ask Aura

        </button>

      </div>

      {/* Workspace */}

      <div className="mx-5 mt-6 rounded-2xl bg-slate-100 p-4">

        <p className="text-xs uppercase text-slate-500">

          Current Workspace

        </p>

        <p className="font-semibold mt-2">

          Main Workspace

        </p>

      </div>

      {/* Logout */}

      <div className="p-5 border-t border-slate-100 mt-6">

        <button

          onClick={() => navigate("/")}

          className="flex items-center gap-3 text-slate-600 hover:text-red-600 transition"

        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>

  );

}