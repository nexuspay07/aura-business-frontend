import { ArrowLeft, RotateCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatDate, personal, StatusPill } from "../components/personal/PersonalUI";
import { getStrategyResource } from "../services/api";

function Section({ title, children, className = "" }) {
  return (
    <section className={`${personal.surface} p-6 sm:p-8 ${className}`}>
      <h2 className={personal.section}>{title}</h2>
      <div className="mt-5 text-base leading-7 text-slate-300">{children}</div>
    </section>
  );
}

function TextList({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li className="flex gap-3" key={`${item}-${index}`}>
          <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />
          <span className="min-w-0 break-words">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ErrorState({ notFound, onRetry }) {
  return (
    <div className={personal.narrow}>
      <section role="alert" className={`${personal.surface} mt-8 p-7 sm:p-10`}>
        <h1 className="text-3xl font-semibold text-white">
          {notFound ? "Strategy not found" : "Strategy could not be loaded"}
        </h1>
        <p className="mt-4 text-slate-400">
          {notFound
            ? "This Strategy does not exist or is not available in your current workspace."
            : "Please try again."}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/strategies" className={`inline-flex min-h-11 items-center rounded-xl bg-blue-500 px-5 font-semibold text-white hover:bg-blue-400 ${personal.focus}`}>
            Back to Strategies
          </Link>
          {!notFound && (
            <button type="button" onClick={onRetry} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-4 font-semibold text-slate-200 hover:bg-white/5 ${personal.focus}`}>
              <RotateCw aria-hidden="true" size={17} />
              Retry
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default function StrategyDetailPage() {
  const { strategyPublicId } = useParams();
  const [requestVersion, setRequestVersion] = useState(0);
  const requestKey = `${strategyPublicId}:${requestVersion}`;
  const requestedKey = useRef(null);
  const [result, setResult] = useState({ key: null, status: "loading", resource: null, errorStatus: null });

  useEffect(() => {
    if (requestedKey.current === requestKey) return;
    requestedKey.current = requestKey;
    getStrategyResource(strategyPublicId)
      .then(value => {
        setResult({ key: requestKey, status: "success", resource: value, errorStatus: null });
      })
      .catch(error => {
        setResult({ key: requestKey, status: "error", resource: null, errorStatus: error?.response?.status || 500 });
      });
  }, [requestKey, strategyPublicId]);

  const loading = result.key !== requestKey || result.status === "loading";
  const errorStatus = result.key === requestKey ? result.errorStatus : null;
  const resource = result.key === requestKey ? result.resource : null;

  if (loading) {
    return <p role="status" className="p-8 text-center text-lg text-slate-400">Loading Strategy…</p>;
  }

  if (errorStatus) {
    return <ErrorState notFound={errorStatus === 404} onRetry={() => setRequestVersion(value => value + 1)} />;
  }

  const strategy = resource?.strategy || {};
  const phases = Array.isArray(strategy.phases) ? strategy.phases : [];
  const resources = Array.isArray(strategy.resources) ? strategy.resources : [];
  const constraints = Array.isArray(strategy.constraints) ? strategy.constraints : [];
  const risks = Array.isArray(strategy.risks) ? strategy.risks : [];
  const successMeasures = Array.isArray(strategy.success_measures) ? strategy.success_measures : [];
  const assumptions = Array.isArray(strategy.assumptions) ? strategy.assumptions : [];
  const uncertainties = Array.isArray(strategy.uncertainties) ? strategy.uncertainties : [];
  const changeConditions = Array.isArray(strategy.change_conditions) ? strategy.change_conditions : [];
  const confidenceRationale = Array.isArray(strategy.confidence_rationale) ? strategy.confidence_rationale : [];
  const evidenceReferences = Array.isArray(strategy.evidence_references) ? strategy.evidence_references : [];

  return (
    <div className={personal.narrow}>
      <Link to="/strategies" className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white ${personal.focus}`}>
        <ArrowLeft aria-hidden="true" size={16} />
        Strategies
      </Link>

      <header className="border-b border-white/[.08] pb-10 pt-9 sm:pb-12">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-400">Revision {resource.current_revision}</span>
          <span className="text-sm text-slate-500">Updated {formatDate(resource.updated_at) || "date unavailable"}</span>
          {resource.archived && <StatusPill>Archived</StatusPill>}
        </div>
        <h1 className={`${personal.title} mt-5 break-words`}>{resource.title || "Untitled Strategy"}</h1>
      </header>

      <div className="mt-8 space-y-5 sm:mt-10">
        <Section title="Overview">
          <dl className="grid gap-6 sm:grid-cols-2">
            {strategy.objective && <div className="sm:col-span-2"><dt className="text-sm font-semibold uppercase tracking-[.12em] text-slate-500">Objective</dt><dd className="mt-2 break-words text-lg text-white">{strategy.objective}</dd></div>}
            {strategy.chosen_direction && <div><dt className="text-sm font-semibold uppercase tracking-[.12em] text-slate-500">Chosen direction</dt><dd className="mt-2 break-words">{strategy.chosen_direction}</dd></div>}
            {strategy.time_horizon && <div><dt className="text-sm font-semibold uppercase tracking-[.12em] text-slate-500">Time horizon</dt><dd className="mt-2 break-words">{strategy.time_horizon}</dd></div>}
            {strategy.confidence && <div><dt className="text-sm font-semibold uppercase tracking-[.12em] text-slate-500">Confidence</dt><dd className="mt-2 capitalize">{String(strategy.confidence).replaceAll("_", " ")}</dd></div>}
          </dl>
        </Section>

        {strategy.approach && <Section title="Strategic Approach"><p className="whitespace-pre-wrap break-words">{strategy.approach}</p></Section>}

        {phases.length > 0 && (
          <Section title="Phases">
            <ol className="space-y-7">
              {phases.map((phase, index) => (
                <li className="grid gap-4 sm:grid-cols-[2.5rem_minmax(0,1fr)]" key={`${phase.order ?? index}-${phase.name}`}>
                  <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-300/10 font-semibold text-blue-200">{phase.order ?? index + 1}</span>
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-semibold text-white">{phase.name}</h3>
                    {phase.purpose && <p className="mt-2 break-words">{phase.purpose}</p>}
                    {phase.focus_areas?.length > 0 && <div className="mt-4"><p className="text-sm font-semibold text-slate-400">Focus areas</p><div className="mt-2"><TextList items={phase.focus_areas} /></div></div>}
                    {phase.milestone_intent && <p className="mt-4"><span className="font-semibold text-slate-400">Milestone intent:</span> {phase.milestone_intent}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {(resources.length > 0 || constraints.length > 0) && (
          <div className="grid gap-5 lg:grid-cols-2">
            {resources.length > 0 && <Section title="Resources">{resources.map((item, index) => <article className="border-b border-white/[.07] py-4 first:pt-0 last:border-0 last:pb-0" key={`${item.name}-${index}`}><h3 className="font-semibold text-white">{item.name}</h3><p className="mt-2 break-words">{item.description}</p></article>)}</Section>}
            {constraints.length > 0 && <Section title="Constraints"><TextList items={constraints.map(item => item.statement)} /></Section>}
          </div>
        )}

        {risks.length > 0 && <Section title="Risks & Mitigations">{risks.map((item, index) => <article className="border-b border-white/[.07] py-4 first:pt-0 last:border-0 last:pb-0" key={`${item.risk}-${index}`}><h3 className="font-semibold text-white">Risk</h3><p className="mt-2 break-words">{item.risk}</p>{item.mitigation && <><h3 className="mt-4 font-semibold text-slate-400">Mitigation</h3><p className="mt-2 break-words">{item.mitigation}</p></>}</article>)}</Section>}

        {successMeasures.length > 0 && <Section title="Success Measures"><ul className="space-y-4">{successMeasures.map((item, index) => <li key={`${item.condition}-${index}`}><p className="break-words">{item.condition}</p>{item.evidence_ref && <p className="mt-1 text-sm text-slate-500">Evidence reference: {item.evidence_ref}</p>}</li>)}</ul></Section>}

        {(assumptions.length > 0 || uncertainties.length > 0) && <div className="grid gap-5 lg:grid-cols-2">{assumptions.length > 0 && <Section title="Assumptions"><ul className="space-y-4">{assumptions.map((item, index) => <li key={`${item.statement}-${index}`}><p className="break-words">{item.statement}</p>{item.source && <p className="mt-1 text-sm text-slate-500">Source: {item.source}</p>}</li>)}</ul></Section>}{uncertainties.length > 0 && <Section title="Uncertainties"><TextList items={uncertainties} /></Section>}</div>}

        {changeConditions.length > 0 && <Section title="Change Conditions"><TextList items={changeConditions} /></Section>}
        {confidenceRationale.length > 0 && <Section title="Confidence Rationale"><TextList items={confidenceRationale} /></Section>}
        {evidenceReferences.length > 0 && <Section title="Evidence References"><ul className="space-y-3">{evidenceReferences.map((item, index) => <li className="break-words" key={`${item.evidence_id}-${index}`}>{item.citation_label || item.evidence_id}{item.citation_label && <span className="ml-2 text-sm text-slate-500">Reference {item.evidence_id}</span>}</li>)}</ul></Section>}
      </div>
    </div>
  );
}
