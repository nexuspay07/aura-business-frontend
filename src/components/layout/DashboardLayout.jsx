import {
  LayoutDashboard,
  Brain,
  Building2,
  FolderKanban,
  BarChart3,
  Database,
  Settings,
  LogOut,
  Bell,
  Search,
} from "lucide-react";

export default function DashboardLayout() {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { icon: <Brain size={20} />, label: "Intelligence" },
    { icon: <FolderKanban size={20} />, label: "Sessions" },
    { icon: <Building2 size={20} />, label: "Organizations" },
    { icon: <BarChart3 size={20} />, label: "Analytics" },
    { icon: <Database size={20} />, label: "Memory" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-white/70 backdrop-blur-xl border-r border-white/40 shadow-xl flex flex-col justify-between px-5 py-6">
        <div>
          {/* LOGO */}
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

          {/* NAVIGATION */}
          <nav className="space-y-3">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  index === 0
                    ? "bg-gradient-to-r from-violet-600 to-blue-500 text-white shadow-lg shadow-violet-200"
                    : "text-slate-700 hover:bg-white hover:shadow-md"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* FOOTER */}
        <button className="flex items-center gap-3 text-slate-500 hover:text-red-500 transition-all px-3 py-2">
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="h-[80px] px-8 flex items-center justify-between border-b border-slate-200 bg-white/60 backdrop-blur-xl">
          {/* SEARCH */}
          <div className="flex items-center gap-3 bg-white shadow-sm border border-slate-200 rounded-2xl px-4 py-3 w-[400px]">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search intelligence..."
              className="bg-transparent outline-none w-full text-slate-700"
            />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">
            <button className="relative bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
              <Bell size={20} className="text-slate-700" />

              <span className="absolute top-2 right-2 w-2 h-2 bg-violet-500 rounded-full"></span>
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

        {/* DASHBOARD BODY */}
        <section className="flex-1 p-8 overflow-auto">
          {/* HEADER */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-slate-900">
              AURA Workspace
            </h2>

            <p className="text-slate-500 mt-2">
              AI-powered enterprise intelligence environment
            </p>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* CARD 1 */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-lg">
              <p className="text-slate-500 text-sm">
                Intelligence Sessions
              </p>

              <h3 className="text-4xl font-bold text-slate-900 mt-4">
                24
              </h3>

              <p className="text-emerald-500 text-sm mt-3">
                +12% growth this week
              </p>
            </div>

            {/* CARD 2 */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-lg">
              <p className="text-slate-500 text-sm">
                Active Organizations
              </p>

              <h3 className="text-4xl font-bold text-slate-900 mt-4">
                3
              </h3>

              <p className="text-blue-500 text-sm mt-3">
                All systems operational
              </p>
            </div>

            {/* CARD 3 */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-lg">
              <p className="text-slate-500 text-sm">
                Strategic Accuracy
              </p>

              <h3 className="text-4xl font-bold text-slate-900 mt-4">
                94%
              </h3>

              <p className="text-violet-500 text-sm mt-3">
                Reinforcement learning active
              </p>
            </div>

            {/* CARD 4 */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-lg">
              <p className="text-slate-500 text-sm">
                AI Status
              </p>

              <h3 className="text-2xl font-bold text-emerald-500 mt-4">
                ONLINE
              </h3>

              <p className="text-slate-500 text-sm mt-3">
                Autonomous intelligence active
              </p>
            </div>
          </div>

          {/* LARGE PANELS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
            {/* LEFT */}
            <div className="xl:col-span-2 bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-lg min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Strategic Intelligence Feed
                  </h3>

                  <p className="text-slate-500 mt-1">
                    Real-time AI business analysis
                  </p>
                </div>

                <div className="px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium">
                  LIVE
                </div>
              </div>

              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <p className="font-semibold text-slate-800">
                    AI detected strong growth opportunity in automation services.
                  </p>

                  <p className="text-slate-500 text-sm mt-2">
                    Recommended market entry through niche operational tooling.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <p className="font-semibold text-slate-800">
                    Strategic reinforcement engine updated competitive model.
                  </p>

                  <p className="text-slate-500 text-sm mt-2">
                    Risk exposure reduced by 18%.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="bg-gradient-to-br from-violet-600 to-blue-500 rounded-3xl p-8 text-white shadow-2xl">
              <p className="text-sm opacity-80">
                Autonomous Intelligence
              </p>

              <h3 className="text-3xl font-bold mt-4">
                AURA Strategic Engine
              </h3>

              <p className="mt-4 text-white/80 leading-relaxed">
                Enterprise intelligence systems are actively learning from
                organizational interactions and strategic decision patterns.
              </p>

              <button className="mt-8 bg-white text-slate-900 px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition-all">
                Open Intelligence
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}