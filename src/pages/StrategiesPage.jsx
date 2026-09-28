import { ArrowRight, RotateCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  EmptyState,
  formatDate,
  PageHeader,
  personal,
  PrimaryLink,
  StatusPill,
} from "../components/personal/PersonalUI";
import { listStrategyResources } from "../services/api";

function StrategyCard({ strategy }) {
  return (
    <article>
      <Link
        to={`/strategies/${encodeURIComponent(strategy.public_id)}`}
        className={`group grid gap-6 rounded-[28px] border border-white/[.09] bg-[#0d1119] p-6 transition hover:border-white/20 hover:bg-[#10151f] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-8 ${personal.focus}`}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-500">
              Updated {formatDate(strategy.updated_at) || "date unavailable"}
            </span>
            {strategy.archived && <StatusPill>Archived</StatusPill>}
          </div>
          <h2 className="mt-4 break-words text-2xl font-semibold leading-8 text-white">
            {strategy.title || "Untitled Strategy"}
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Revision {strategy.current_revision}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 font-semibold text-blue-300 transition group-hover:text-blue-200">
          Open Strategy
          <ArrowRight aria-hidden="true" size={18} />
        </span>
      </Link>
    </article>
  );
}

export default function StrategiesPage() {
  const [requestVersion, setRequestVersion] = useState(0);
  const requestedVersion = useRef(null);
  const [result, setResult] = useState({ version: -1, status: "loading", items: [] });

  useEffect(() => {
    if (requestedVersion.current === requestVersion) return;
    requestedVersion.current = requestVersion;
    listStrategyResources()
      .then((response) => {
        setResult({ version: requestVersion, status: "success", items: Array.isArray(response?.items) ? response.items : [] });
      })
      .catch(() => {
        setResult({ version: requestVersion, status: "error", items: [] });
      });
  }, [requestVersion]);

  const loading = result.version !== requestVersion || result.status === "loading";
  const error = result.version === requestVersion && result.status === "error";
  const strategies = result.items;

  return (
    <div className={personal.page}>
      <PageHeader title="Strategies">
        <p>Persistent strategic direction developed from your saved Decisions.</p>
      </PageHeader>

      <div className="pt-8 sm:pt-10">
        {loading && (
          <p role="status" className="py-14 text-center text-lg text-slate-400">
            Loading Strategies…
          </p>
        )}

        {!loading && error && (
          <section role="alert" className={`${personal.surface} p-7 sm:p-9`}>
            <h2 className="text-xl font-semibold text-white">Strategies could not be loaded</h2>
            <p className="mt-3 text-slate-400">Please try again.</p>
            <button
              type="button"
              onClick={() => setRequestVersion(value => value + 1)}
              className={`mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-4 font-semibold text-slate-200 hover:bg-white/5 ${personal.focus}`}
            >
              <RotateCw aria-hidden="true" size={17} />
              Retry
            </button>
          </section>
        )}

        {!loading && !error && strategies.length === 0 && (
          <EmptyState
            title="No Strategies yet"
            action={<PrimaryLink to="/decisions">Go to Decisions</PrimaryLink>}
          >
            <p>Develop a Strategy from a saved Decision.</p>
          </EmptyState>
        )}

        {!loading && !error && strategies.length > 0 && (
          <div className="space-y-4">
            {strategies.map(strategy => (
              <StrategyCard key={strategy.public_id} strategy={strategy} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
