import {
  TrendingUp,
  AlertTriangle,
  Brain,
} from "lucide-react";

export default function IntelligenceFeedCard({
  marketInsight,
  warning,
  reinforcementStatus,
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

      <div className="flex items-center gap-3">
        <Brain
          size={22}
          className="text-violet-600"
        />

        <h2 className="text-xl font-bold text-slate-900">
          Intelligence Feed
        </h2>
      </div>

      <div className="mt-6 space-y-4">

        <div className="bg-slate-50 rounded-2xl p-4">

          <div className="flex items-center gap-2 mb-2">
            <TrendingUp
              size={16}
              className="text-green-600"
            />

            <span className="text-xs uppercase tracking-wide text-slate-500">
              Market Intelligence
            </span>
          </div>

          <p className="text-slate-700">
            {marketInsight ||
              "No market intelligence available."}
          </p>

        </div>

        <div className="bg-slate-50 rounded-2xl p-4">

          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle
              size={16}
              className="text-red-500"
            />

            <span className="text-xs uppercase tracking-wide text-slate-500">
              Risk Signal
            </span>
          </div>

          <p className="text-slate-700">
            {warning ||
              "No major risks detected."}
          </p>

        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-5 text-white">

          <p className="text-xs uppercase tracking-wide opacity-80">
            Reinforcement Status
          </p>

          <p className="mt-2 font-semibold">
            {reinforcementStatus ||
              "Learning system active."}
          </p>

        </div>

      </div>

    </div>
  );
}