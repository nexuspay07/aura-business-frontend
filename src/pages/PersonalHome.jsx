import { ArrowRight, CalendarDays } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { consumerText, formatDate, personal, SectionHeading, StatusPill, summaryText, truncateTitle } from "../components/personal/PersonalUI";
import { listPersonalDecisions } from "../services/api";

const examples = ["Should I take this job offer?", "Can I afford this purchase?", "Should I go back to school?", "Which option fits my priorities better?"];
const greeting = () => { const hour = new Date().getHours(); return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"; };
const focusClass = personal.focus;

function PrimaryDecision({ decision }) {
  return <Link to={`/decisions/${decision.id}`} className={`group block overflow-hidden rounded-[32px] border border-blue-300/20 bg-[#101722] p-7 transition hover:border-blue-300/40 sm:p-10 ${focusClass}`}>
    <div className="flex flex-wrap items-center gap-3"><StatusPill>{decision.status || "Open"}</StatusPill>{(decision.updated_at || decision.created_at) && <span className="text-sm text-slate-500">Saved {formatDate(decision.updated_at || decision.created_at)}</span>}{decision.review_date && <span className="inline-flex items-center gap-1.5 text-sm text-blue-200"><CalendarDays size={15}/>Review {formatDate(decision.review_date)}</span>}</div>
    <h3 className="mt-7 max-w-4xl text-2xl font-semibold leading-tight tracking-[-.02em] text-white sm:text-3xl">{truncateTitle(consumerText(decision.title))}</h3>
    <div className="mt-8 grid gap-7 border-t border-white/[.08] pt-7 sm:grid-cols-[1fr_auto] sm:items-end"><div><p className="text-sm font-medium text-slate-500">{decision.user_choice ? "You chose" : "Aura recommends"}</p><p className="mt-2 max-w-3xl text-xl font-medium leading-8 text-slate-100">{summaryText(decision.user_choice || decision.recommendation) || "Open this decision to continue."}</p></div><span className="inline-flex items-center gap-2 font-semibold text-blue-300 transition group-hover:translate-x-1">View decision <ArrowRight size={18}/></span></div>
  </Link>;
}

function RecentDecision({ decision }) {
  return <Link to={`/decisions/${decision.id}`} className={`group flex min-h-64 flex-col justify-between rounded-[26px] border border-white/[.09] bg-[#0d1119] p-6 transition hover:-translate-y-0.5 hover:border-white/20 ${focusClass}`}><div><StatusPill>{decision.status || "Open"}</StatusPill><h3 className="mt-5 text-xl font-semibold leading-7 text-white">{truncateTitle(consumerText(decision.title), 72)}</h3><p className="mt-4 line-clamp-2 leading-7 text-slate-400"><span className="text-slate-300">{decision.user_choice ? "You chose:" : "Aura recommends:"}</span> {consumerText(decision.user_choice || decision.recommendation) || "Not decided yet"}</p></div><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-300">Open decision <ArrowRight className="transition group-hover:translate-x-1" size={16}/></span></Link>;
}

export default function PersonalHome() {
  const { user } = useSession(); const [decisions, setDecisions] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const firstName = user?.full_name?.trim().split(/\s+/)[0];
  useEffect(() => { let active = true; listPersonalDecisions().then((items) => { if (active) setDecisions(Array.isArray(items) ? items : []); }).catch(() => { if (active) setError("We couldn't load your decisions right now."); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  const ordered = useMemo(() => [...decisions].sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0)), [decisions]);
  const primary = useMemo(() => [...decisions].sort((a, b) => Number(Boolean(b.review_date)) - Number(Boolean(a.review_date)) || new Date(b.updated_at || 0) - new Date(a.updated_at || 0))[0], [decisions]);
  const recent = ordered.filter((item) => item.id !== primary?.id).slice(0, 3);
  return <div className={personal.page}>
    <section className="pb-12 pt-8 sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-20"><p className="text-base font-medium text-blue-200">{greeting()}{firstName ? `, ${firstName}` : ""}</p><h1 className={`${personal.hero} mt-5 max-w-4xl`}>What matters most right now?</h1><p className={`${personal.body} mt-6 max-w-2xl`}>Make a decision, revisit something important, or keep moving toward what matters to you.</p><div className="mt-9 flex flex-wrap gap-3"><Link to="/intelligence" className={`inline-flex min-h-12 items-center rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400 ${focusClass}`}>Talk to Aura</Link><Link to="/decisions" className={`inline-flex min-h-12 items-center rounded-xl border border-white/15 px-6 py-3 font-semibold text-slate-200 transition hover:bg-white/[.06] ${focusClass}`}>View decisions</Link></div></section>
    <section aria-labelledby="current-focus-title"><SectionHeading eyebrow="Current focus"><span className="sr-only" id="current-focus-title">Current focus</span>{primary ? "One decision worth your attention" : "Start with what matters"}</SectionHeading>{loading && <p role="status" className="py-12 text-lg text-slate-400">Loading your decisions…</p>}{error && <p role="alert" className="rounded-2xl border border-red-400/20 bg-red-400/[.06] p-5 text-red-200">{error}</p>}
      {!loading && !error && !primary && <div className={`${personal.surface} px-7 py-12 sm:px-10 sm:py-16`}><h2 className="text-3xl font-semibold tracking-tight text-white">What are you trying to figure out?</h2><p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">Use Aura for decisions about work, money, education, purchases, projects, and other important choices.</p><Link to="/intelligence" className={`mt-7 inline-flex rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-400 ${focusClass}`}>Talk to Aura</Link><div className="mt-9 flex flex-wrap gap-3" aria-label="Example decisions">{examples.map((example) => <Link key={example} to="/intelligence" state={{ suggestedPrompt: example }} className={`rounded-full border border-white/10 bg-white/[.025] px-4 py-2.5 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/[.05] ${focusClass}`}>{example}</Link>)}</div></div>}
      {!loading && !error && primary && <PrimaryDecision decision={primary}/>}</section>
    {recent.length > 0 && <section className="mt-14 sm:mt-20" aria-labelledby="recent-decisions-title"><SectionHeading action={<Link className={`text-sm font-semibold text-blue-300 hover:text-blue-200 ${focusClass}`} to="/decisions">View all</Link>}><span id="recent-decisions-title">Recent decisions</span></SectionHeading><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{recent.map((decision) => <RecentDecision key={decision.id} decision={decision}/>)}</div></section>}
  </div>;
}
