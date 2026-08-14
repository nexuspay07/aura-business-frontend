import { ArrowRight, BrainCircuit, Building2, CircleGauge, Database, Layers3, Play, Sparkles, Workflow } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  [Building2, "Organizations", "Keep company identity, members, and ownership in one secure boundary."],
  [Layers3, "Workspaces", "Give teams a focused operating context for their work and decisions."],
  [BrainCircuit, "Decision Center", "Turn strategic questions into structured executive analysis."],
  [CircleGauge, "Decision analysis", "Review risks, opportunities, recommendations, and next actions."],
  [Database, "Knowledge memory", "Retain useful organizational context across intelligence work."],
  [Workflow, "Business simulation", "Model supported strategic scenarios before committing resources."],
];

const platformAreas = [
  ["Organizations & workspaces", "The secure structure for people, contexts, and operational ownership."],
  ["Decision Center", "Executive intelligence and saved analytical sessions."],
  ["Marketplace", "A capability library for public and organization-owned strategy items."],
  ["Simulation Center", "Scenario execution and saved organization-scoped simulation history."],
  ["Commercial Platform", "Tenant-scoped billing accounts, subscriptions, usage, invoices, refunds, and credit notes."],
  ["Settings", "Supported organization, workspace, and member configuration."],
];

function LandingNav() {
  return <div className="flex items-center gap-5 text-sm text-slate-300">
    <a className="rounded focus-visible:outline-none" href="#features">Features</a>
    <a className="rounded focus-visible:outline-none" href="#platform">Platform</a>
    <a className="rounded focus-visible:outline-none" href="#pricing">Pricing</a>
  </div>;
}

export default function Landing() {
  return <main className="landing min-h-screen overflow-hidden bg-[#07090d] text-white">
    <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6 lg:px-8">
      <Link to="/" className="flex items-center gap-3 font-semibold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500 text-lg shadow-[0_0_32px_rgba(59,130,246,.45)]">A</span><span>Aura <span className="text-slate-400">OS</span></span></Link>
      <div className="hidden md:block"><LandingNav /></div>
      <Link className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium transition hover:border-white/35 hover:bg-white/5" to="/login">Login</Link>
      <div className="w-full overflow-x-auto md:hidden"><LandingNav /></div>
    </nav>

    <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 text-center lg:px-8 lg:pt-28"><div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-[120px]"/><p className="relative mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-200"><Sparkles size={14}/> Intelligence, operationalized</p><h1 className="relative mx-auto max-w-4xl text-5xl font-semibold tracking-[-.055em] sm:text-6xl lg:text-7xl">Aura OS</h1><p className="relative mx-auto mt-5 max-w-3xl text-xl font-medium tracking-tight text-slate-200 sm:text-2xl">The Enterprise Operating System for AI-Powered Decision Intelligence.</p><p className="relative mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400">Build organizations, manage workspaces, collaborate with teams, and make strategic decisions using autonomous AI intelligence.</p><div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-semibold shadow-lg shadow-blue-500/20 transition hover:bg-blue-400">Launch Aura <ArrowRight size={17}/></Link><a href="#platform" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-semibold transition hover:bg-white/10"><Play size={16}/> Learn More</a></div></section>

    <section id="features" aria-labelledby="features-heading" className="border-y border-white/8 bg-white/[.025] scroll-mt-6"><div className="mx-auto max-w-7xl px-6 py-24 lg:px-8"><div className="max-w-2xl"><p className="text-sm font-medium text-blue-300">Available capabilities</p><h2 id="features-heading" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Features for deliberate decisions.</h2><p className="mt-4 leading-7 text-slate-400">Each capability below is available in Aura OS today. They describe what teams can do—not product tiers or future promises.</p></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{features.map(([Icon, title, text]) => <article key={title} className="rounded-2xl border border-white/10 bg-[#0b0e14] p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-400/10 text-blue-300"><Icon size={19}/></span><h3 className="mt-5 font-medium">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></article>)}</div></div></section>

    <section id="platform" aria-labelledby="platform-heading" className="scroll-mt-6"><div className="mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div><p className="text-sm font-medium text-blue-300">The operating environment</p><h2 id="platform-heading" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">One connected environment for the work around a decision.</h2><p className="mt-4 leading-7 text-slate-400">Aura OS brings organizational context, decision intelligence, simulations, commercial records, and configuration into the same authenticated operating environment.</p></div><dl className="grid gap-3 sm:grid-cols-2">{platformAreas.map(([term, description]) => <div key={term} className="rounded-xl border border-white/10 bg-white/[.03] p-5"><dt className="font-medium text-white">{term}</dt><dd className="mt-2 text-sm leading-6 text-slate-400">{description}</dd></div>)}</dl></div></section>

    <section id="pricing" aria-labelledby="pricing-heading" className="border-y border-white/8 bg-white/[.025] scroll-mt-6"><div className="mx-auto max-w-7xl px-6 py-24 lg:px-8"><div className="max-w-2xl"><p className="text-sm font-medium text-blue-300">Pricing overview</p><h2 id="pricing-heading" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A model for individuals, teams, and organizations.</h2><p className="mt-4 leading-7 text-slate-400">Aura OS supports Personal, Business, and Enterprise account types. Public plan discovery and exact prices are not currently available.</p></div><div className="mt-10 grid gap-4 md:grid-cols-3">{[["Personal", "For individual operating contexts."], ["Business", "For organizations and collaborative workspaces."], ["Enterprise", "For organization-scale operating environments."]].map(([name, description]) => <article key={name} className="rounded-2xl border border-white/10 bg-[#0b0e14] p-6"><h3 className="text-xl font-medium">{name}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{description}</p><p className="mt-6 text-sm font-medium text-blue-300">Pricing details coming soon</p></article>)}</div></div></section>
    <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>© 2026 Aura OS</span><span>Built for deliberate organizations.</span></footer>
  </main>;
}
