import { useState } from "react";
import { CheckCircle2, ChevronDown, Clipboard, ShieldAlert, Target } from "lucide-react";

function ReportText({ children }) {
  if (!children) return <p className="text-sm text-slate-500">No material available from the current analysis.</p>;
  const parts = String(children).split(/(\*\*[^*]+\*\*)/g);
  return <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{parts.map((part, index) => part.startsWith("**") && part.endsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : part)}</p>;
}

function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return <section className="rounded-2xl border border-slate-200 bg-white">
    <button className="flex w-full items-center justify-between px-5 py-4 text-left" onClick={() => setOpen(!open)}>
      <span className="font-semibold text-slate-900">{title}</span>
      <ChevronDown className={`h-4 w-4 text-slate-500 transition ${open ? "rotate-180" : ""}`} />
    </button>
    {open && <div className="border-t border-slate-100 px-5 py-4">{children}</div>}
  </section>;
}

export default function ExecutiveReport({ report }) {
  if (!report) return <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">Submit an executive mission to generate a decision-ready report.</div>;
  const confidence = report.confidence?.score ?? 0;
  const copyReport = () => navigator.clipboard?.writeText(JSON.stringify(report, null, 2));

  return <article className="space-y-5">
    <header className="rounded-3xl bg-slate-950 p-7 text-white shadow-xl">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">Aevric AI executive intelligence</p><h2 className="mt-2 text-2xl font-bold">{report.title}</h2></div><button onClick={copyReport} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-xs hover:bg-white/10"><Clipboard size={14} />Copy report</button></div>
      <p className="mt-5 max-w-3xl text-base leading-7 text-slate-200">{report.executive_summary}</p>
      <div className="mt-6 flex flex-wrap gap-3"><span className="rounded-full bg-white/10 px-3 py-1 text-sm">Confidence: {confidence}%</span><span className="rounded-full bg-white/10 px-3 py-1 text-sm">{report.confidence?.level || "moderate"} evidence</span></div>
    </header>

    <div className="grid gap-4 md:grid-cols-4">
      {(report.kpis || []).map((kpi) => <div key={kpi.name} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-medium uppercase tracking-wide text-slate-500">{kpi.name}</p><p className="mt-2 text-lg font-bold text-slate-900">{kpi.value ?? "—"}</p></div>)}
    </div>

    <div className="grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <Section title="Situation overview" defaultOpen><ReportText>{report.situation_overview}</ReportText></Section>
        <Section title="Strategic analysis" defaultOpen><ReportText>{report.strategic_analysis?.verdict}</ReportText><ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">{(report.strategic_analysis?.reasoning || []).map((item) => <li key={item}>{item}</li>)}</ul></Section>
        <Section title="Market & competitive intelligence"><div className="grid gap-4 md:grid-cols-2"><ReportText>{report.market_intelligence?.positioning}</ReportText><dl className="space-y-2 text-sm text-slate-700"><div>Market: {report.market_intelligence?.market_type || "Unknown"}</div><div>Competition: {report.competitive_intelligence?.intensity || "Unknown"}</div><div>Defensible advantage: {report.competitive_intelligence?.advantage || "Unknown"}</div><div>Moat: {report.competitive_intelligence?.moat || "Unknown"}</div></dl></div></Section>
        <Section title="Implementation roadmap" defaultOpen><div className="space-y-3">{(report.implementation_roadmap || []).map((step) => <div key={step.phase} className="border-l-2 border-violet-500 pl-4"><p className="font-semibold text-slate-900">{step.timeframe} · {step.phase}</p><ReportText>{step.focus}</ReportText></div>)}</div></Section>
      </div>
      <aside className="space-y-4">
        <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5"><Target className="text-violet-700" size={20}/><h3 className="mt-3 font-semibold text-slate-900">Recommended strategy</h3><ReportText>{report.recommended_strategy?.recommendation || report.recommended_strategy?.operational_move}</ReportText></div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><ShieldAlert className="text-amber-700" size={20}/><h3 className="mt-3 font-semibold text-slate-900">Key risks</h3><ul className="mt-2 space-y-2 text-sm text-slate-700">{(report.key_risks || []).map((risk) => <li key={risk}>• {risk}</li>)}</ul></div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><CheckCircle2 className="text-emerald-700" size={20}/><h3 className="mt-3 font-semibold text-slate-900">Next actions</h3><ol className="mt-2 space-y-2 text-sm text-slate-700">{(report.suggested_next_actions || []).map((action, index) => <li key={action}>{index + 1}. {action}</li>)}</ol></div>
      </aside>
    </div>

    <Section title="Business context, assumptions & sources"><div className="grid gap-5 md:grid-cols-3 text-sm text-slate-700"><div><p className="font-semibold text-slate-900">Business context</p><pre className="mt-2 overflow-auto whitespace-pre-wrap font-sans">{JSON.stringify(report.business_context, null, 2)}</pre></div><div><p className="font-semibold text-slate-900">Assumptions</p>{(report.assumptions || []).map((item) => <p key={item} className="mt-2">• {item}</p>)}</div><div><p className="font-semibold text-slate-900">Pipeline sources</p>{(report.sources || []).map((item) => <p key={item} className="mt-2">• {item}</p>)}</div></div></Section>
  </article>;
}
