import {
LayoutDashboard,
Brain,
FolderKanban,
Building2,
BarChart3,
Database,
Settings,
LogOut,
Bell,
Search,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

export default function DashboardLayout({ children }) {
const navigate = useNavigate();
const location = useLocation();

const menuItems = [
{
icon: <LayoutDashboard size={20} />,
label: "Dashboard",
route: "/dashboard",
},
{
icon: <Brain size={20} />,
label: "Intelligence",
route: "/intelligence",
},
{
icon: <FolderKanban size={20} />,
label: "Sessions",
route: "/sessions",
},
{
icon: <Building2 size={20} />,
label: "Organizations",
route: "/organizations",
},
{
icon: <BarChart3 size={20} />,
label: "Analytics",
route: "/analytics",
},
{
icon: <Database size={20} />,
label: "Memory",
route: "/memory",
},
{
icon: <Settings size={20} />,
label: "Settings",
route: "/settings",
},
];

return ( <div className="min-h-screen bg-[#f4f7fb] flex overflow-hidden">

```
  {/* SIDEBAR */}
  <aside className="w-[260px] bg-white/70 backdrop-blur-xl border-r border-white/40 shadow-xl flex flex-col justify-between px-5 py-6">

    <div>

      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          AURA
        </h1>

        <p className="text-blue-600 text-xl font-light -mt-2">
          Business
        </p>

        <p className="text-xs text-slate-500 mt-2">
          Enterprise Intelligence OS
        </p>
      </div>

      <nav className="space-y-3">

        {menuItems.map((item) => {

          const active =
            location.pathname === item.route;

          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                active
                  ? "bg-gradient-to-r from-violet-600 to-blue-500 text-white shadow-lg shadow-violet-200"
                  : "text-slate-700 hover:bg-white hover:shadow-md"
              }`}
            >
              {item.icon}

              <span className="font-medium">
                {item.label}
              </span>
            </button>
          );
        })}

      </nav>
    </div>

    <button
      onClick={() => navigate("/")}
      className="flex items-center gap-3 text-slate-500 hover:text-red-500 transition-all px-3 py-2"
    >
      <LogOut size={18} />
      Logout
    </button>

  </aside>

  {/* MAIN */}
  <main className="flex-1 flex flex-col">

    <header className="h-[80px] px-8 flex items-center justify-between border-b border-slate-200 bg-white/60 backdrop-blur-xl">

      <div className="flex items-center gap-3 bg-white shadow-sm border border-slate-200 rounded-2xl px-4 py-3 w-[400px]">

        <Search
          size={18}
          className="text-slate-400"
        />

        <input
          type="text"
          placeholder="Search intelligence..."
          className="bg-transparent outline-none w-full text-slate-700"
        />
      </div>

      <div className="flex items-center gap-5">

        <button className="relative bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
          <Bell
            size={20}
            className="text-slate-700"
          />
        </button>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">

          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-blue-500"></div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Blaise
            </p>

            <p className="text-xs text-slate-500">
              Founder
            </p>
          </div>

        </div>

      </div>

    </header>

        <section className="flex-1 p-8 overflow-auto">
      {children}
    </section>

  </main>

</div>
  );
}