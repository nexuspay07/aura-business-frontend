export default function ExecutiveMissionCard({
  objective,
  strategy,
  confidence,
  risk,
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          Executive Mission
        </h2>

        <div className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-medium">
          ACTIVE
        </div>
      </div>

      <div className="mt-6 space-y-5">

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Current Objective
          </p>

          <p className="text-slate-800 font-medium mt-1">
            {objective || "Awaiting strategic objective..."}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Recommended Strategy
          </p>

          <p className="text-blue-600 font-semibold mt-1">
            {strategy || "No strategy available"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-xs text-slate-500">
              Confidence
            </p>

            <h3 className="text-2xl font-bold text-slate-900 mt-2">
              {confidence || 0}%
            </h3>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-xs text-slate-500">
              Risk Level
            </p>

            <h3 className="text-2xl font-bold text-slate-900 mt-2">
              {risk || "Unknown"}
            </h3>
          </div>

        </div>

      </div>

    </div>
  );
}