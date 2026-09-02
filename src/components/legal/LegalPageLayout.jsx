import { Link } from "react-router-dom";

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b12]";

export default function LegalPageLayout({ eyebrow, title, intro, children }) {
  return <main className="min-h-screen bg-[#080b12] text-slate-100"><nav aria-label="Legal navigation" className="border-b border-white/10 px-5 py-5 sm:px-8 lg:px-16"><div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4"><Link to="/" className={`text-lg font-semibold tracking-tight text-white ${focus}`}>Aevric</Link><div className="flex flex-wrap gap-5 text-sm text-slate-400"><Link to="/privacy" className={`hover:text-white ${focus}`}>Privacy</Link><Link to="/terms" className={`hover:text-white ${focus}`}>Terms</Link><Link to="/alpha" className={`hover:text-white ${focus}`}>Private Alpha</Link></div></div></nav><article className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[.14em] text-blue-300">{eyebrow}</p><h1 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-white sm:text-5xl">{title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{intro}</p><p className="mt-4 text-sm text-slate-500">Effective September 2026</p><div className="mt-12 space-y-10">{children}</div></article><footer className="border-t border-white/10 px-5 py-8 text-sm text-slate-500 sm:px-8"><div className="mx-auto flex max-w-4xl flex-wrap justify-between gap-4"><span>&copy; 2026 Aevric</span><Link to="/" className="hover:text-white">Return home</Link></div></footer></main>;
}

export function LegalSection({ title, children }) {
  return <section><h2 className="text-2xl font-semibold text-white">{title}</h2><div className="mt-4 space-y-4 leading-7 text-slate-300">{children}</div></section>;
}
