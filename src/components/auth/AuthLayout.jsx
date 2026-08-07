import { ArrowUpRight, BrainCircuit, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthLayout({ eyebrow="Aura OS", title, subtitle, description, children }) {
  return <main className="min-h-screen bg-[#080a0f] text-white lg:grid lg:grid-cols-[2fr_3fr]">
    <section className="relative hidden overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
      <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-blue-600/20 blur-[110px]" />
      <Link to="/" className="relative flex items-center gap-3 font-semibold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/30">A</span><span>Aura <span className="text-slate-400">OS</span></span></Link>
      <div className="relative max-w-md"><p className="mb-5 text-sm font-medium text-blue-300">{eyebrow}</p><h1 className="text-5xl font-semibold tracking-[-.05em]">{title}</h1><p className="mt-5 text-lg leading-8 text-slate-400">{subtitle || description}</p><div className="mt-12 rounded-2xl border border-white/10 bg-white/[.045] p-5 backdrop-blur"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/15 text-blue-300"><BrainCircuit size={20}/></span><div><p className="text-sm font-medium">Decision Intelligence</p><p className="text-xs text-slate-500">Executive context, always available</p></div></div><div className="mt-6 flex items-center justify-between rounded-xl bg-black/20 p-4 text-sm"><span className="text-slate-400">Signal confidence</span><b className="text-blue-300">94%</b></div></div></div>
      <div className="relative flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={15}/> Enterprise-ready security and organization isolation</div>
    </section>
    <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8"><div className="w-full max-w-md"><Link to="/" className="mb-12 flex items-center gap-3 font-semibold lg:hidden"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500">A</span>Aura OS</Link><div className="rounded-2xl border border-white/10 bg-[#10131b] p-6 shadow-2xl shadow-black/30 sm:p-9"><div className="mb-8"><p className="text-sm text-blue-300 lg:hidden">{eyebrow}</p><h2 className="mt-2 text-3xl font-semibold tracking-tight lg:hidden">{title}</h2><p className="mt-2 text-sm text-slate-400 lg:hidden">{subtitle || description}</p></div>{children}</div><Link to="/" className="mt-6 flex items-center justify-center gap-1 text-sm text-slate-500 transition hover:text-slate-300">Explore Aura OS <ArrowUpRight size={15}/></Link></div></section>
  </main>;
}
