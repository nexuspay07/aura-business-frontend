import { AlertTriangle, RefreshCw } from "lucide-react";
import { formatNumber, windows } from "./controlCenterFormat";

export function WindowSelector({ value, onChange }) {
  return <fieldset className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/20 p-1">
    <legend className="sr-only">Analytics window</legend>
    {windows.map(([key, label]) => <button key={key} type="button" aria-pressed={value === key} onClick={() => onChange(key)} className={`min-h-10 rounded-lg px-3 text-sm font-medium transition ${value === key ? "bg-blue-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>{label}</button>)}
  </fieldset>;
}

export function PageHeading({ eyebrow, title, description, action }) {
  return <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
    <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-300">{eyebrow}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{description}</p></div>
    {action}
  </header>;
}

export function LoadingState({ label }) {
  return <div role="status" className="grid min-h-64 place-items-center rounded-2xl border border-white/10 bg-white/[.025]"><div className="text-center"><span className="mx-auto block h-7 w-7 animate-spin rounded-full border-2 border-blue-300/30 border-t-blue-300"/><p className="mt-4 text-sm text-slate-400">{label}</p></div></div>;
}

export function ErrorState({ status, onRetry }) {
  if (status === 403) return <div role="alert" className="grid min-h-64 place-items-center rounded-2xl border border-amber-300/20 bg-amber-300/[.04] p-8 text-center"><div><AlertTriangle className="mx-auto text-amber-300"/><h1 className="mt-4 text-2xl font-semibold text-white">Access denied</h1><p className="mt-2 text-sm text-slate-400">Your account does not have access to Control Center.</p></div></div>;
  return <div role="alert" className="grid min-h-64 place-items-center rounded-2xl border border-red-300/20 bg-red-300/[.04] p-8 text-center"><div><h2 className="text-xl font-semibold text-white">Control Center is temporarily unavailable</h2><p className="mt-2 text-sm text-slate-400">The operational data could not be loaded.</p><button type="button" onClick={onRetry} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 font-medium text-slate-950"><RefreshCw size={16}/>Try again</button></div></div>;
}

export function CompletenessNotice({ completeness }) {
  if (!completeness) return null;
  const date = new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(completeness.canonical_telemetry_since));
  const partial = completeness.request_telemetry?.startsWith("partial");
  return <aside className="rounded-xl border border-blue-300/20 bg-blue-300/[.05] px-4 py-3 text-sm text-blue-100"><strong>{partial ? "Partial request history." : "Canonical request data."}</strong> Request analytics are available from {date}. User and saved-decision records may cover a longer period.</aside>;
}

export function MetricCard({ label, value, detail }) {
  return <article className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><p className="text-xs font-medium uppercase tracking-[.12em] text-slate-500">{label}</p><p className="mt-3 text-2xl font-semibold tabular-nums text-white">{value}</p>{detail && <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>}</article>;
}

export function Section({ title, description, children }) {
  return <section><div className="mb-4"><h2 className="text-lg font-semibold text-white">{title}</h2>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div>{children}</section>;
}

export function DistributionBars({ items, empty = "No data in this period." }) {
  if (!items?.length) return <p className="rounded-xl border border-dashed border-white/10 p-6 text-sm text-slate-500">{empty}</p>;
  const max = Math.max(...items.map(item => item.count), 1);
  return <div className="space-y-3">{items.map(item => <div key={item.key}><div className="mb-1.5 flex justify-between gap-4 text-sm"><span className="truncate text-slate-300">{item.key}</span><span className="tabular-nums text-slate-500">{formatNumber(item.count)}</span></div><div className="h-2 overflow-hidden rounded-full bg-white/[.06]"><div className="h-full rounded-full bg-blue-400" style={{ width: `${Math.max(3, item.count / max * 100)}%` }}/></div></div>)}</div>;
}
