import {
  Brain,
  Cpu,
  Database,
  Activity,
  Orbit,
} from "lucide-react";

export default function AuraBrainCard() {
  const systems = [
    {
      icon: <Brain size={18} />,
      name: "Business Understanding",
      status: "ACTIVE",
    },
    {
      icon: <Orbit size={18} />,
      name: "Strategic Simulation",
      status: "ACTIVE",
    },
    {
      icon: <Cpu size={18} />,
      name: "Prediction Engine",
      status: "ACTIVE",
    },
    {
      icon: <Database size={18} />,
      name: "Memory Engine",
      status: "ONLINE",
    },
    {
      icon: <Activity size={18} />,
      name: "Learning Engine",
      status: "LEARNING",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

      <div className="flex items-center gap-3">
        <Brain
          size={22}
          className="text-violet-600"
        />

        <h2 className="text-xl font-bold text-slate-900">
          Aevric AI Brain
        </h2>
      </div>

      <div className="mt-6 space-y-3">

        {systems.map((system) => (
          <div
            key={system.name}
            className="flex items-center justify-between bg-slate-50 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3 text-slate-700">
              {system.icon}

              <span className="font-medium">
                {system.name}
              </span>
            </div>

            <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              {system.status}
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}
