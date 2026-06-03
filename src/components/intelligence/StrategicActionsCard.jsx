import {
  ArrowUpRight,
  Target,
  Rocket,
} from "lucide-react";

export default function StrategicActionsCard({
  executionFocus,
  recommendation,
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

      <div className="flex items-center gap-3">
        <Rocket
          size={22}
          className="text-blue-600"
        />

        <h2 className="text-xl font-bold text-slate-900">
          Strategic Actions
        </h2>
      </div>

      <div className="mt-6 space-y-4">

        <div className="bg-slate-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target
              size={16}
              className="text-violet-600"
            />

            <span className="text-xs uppercase tracking-wide text-slate-500">
              Execution Focus
            </span>
          </div>

          <p className="text-slate-700">
            {executionFocus ||
              "No execution focus available."}
          </p>
        </div>

        <div className="bg-gradient-to-r from-violet-600 to-blue-500 rounded-2xl p-5 text-white">

          <div className="flex items-center gap-2 mb-3">
            <ArrowUpRight size={18} />

            <span className="font-semibold">
              Recommended Next Move
            </span>
          </div>

          <p className="text-sm leading-relaxed">
            {recommendation ||
              "No recommendation generated."}
          </p>

        </div>

      </div>

    </div>
  );
}