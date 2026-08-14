import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/* eslint-disable react-refresh/only-export-components */

export const personal = {
  page: "mx-auto w-full max-w-[1320px] px-1 pb-16 sm:px-3 lg:px-6",
  narrow: "mx-auto w-full max-w-5xl px-1 pb-16 sm:px-3 lg:px-6",
  eyebrow: "text-sm font-semibold uppercase tracking-[.16em] text-blue-300/80",
  hero: "text-4xl font-semibold leading-[1.08] tracking-[-.035em] text-white sm:text-5xl lg:text-6xl",
  title: "text-4xl font-semibold tracking-[-.03em] text-white sm:text-5xl",
  section: "text-xl font-semibold tracking-[-.015em] text-white sm:text-2xl",
  body: "text-base leading-7 text-slate-400 sm:text-lg",
  surface: "rounded-[28px] border border-white/[.09] bg-[#0d1119]",
  focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080a0f]",
};

export function PageHeader({ eyebrow, title, children, action }) {
  return <header className="flex flex-col gap-7 border-b border-white/[.08] pb-10 pt-5 sm:pb-12 sm:pt-9 lg:flex-row lg:items-end lg:justify-between">
    <div className="max-w-3xl">{eyebrow && <p className={personal.eyebrow}>{eyebrow}</p>}<h1 className={`${personal.title} ${eyebrow ? "mt-4" : ""}`}>{title}</h1>{children && <div className={`mt-4 max-w-2xl ${personal.body}`}>{children}</div>}</div>{action}
  </header>;
}

export function SectionHeading({ children, action, eyebrow }) {
  return <div className="mb-5 flex items-end justify-between gap-4"><div>{eyebrow && <p className={personal.eyebrow}>{eyebrow}</p>}<h2 className={`${personal.section} ${eyebrow ? "mt-2" : ""}`}>{children}</h2></div>{action}</div>;
}

export function PrimaryLink({ to, state, children, className = "" }) {
  return <Link to={to} state={state} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400 active:bg-blue-600 ${personal.focus} ${className}`}>{children}</Link>;
}

export function StatusPill({ children }) {
  return <span className="inline-flex rounded-full border border-white/10 bg-white/[.05] px-3 py-1 text-xs font-semibold uppercase tracking-[.12em] text-slate-300">{children}</span>;
}

export function TextAction({ children }) {
  return <span className="inline-flex items-center gap-2 font-semibold text-blue-300 transition group-hover:text-blue-200">{children}<ArrowRight size={17}/></span>;
}

export function EmptyState({ title, children, action }) {
  return <section className={`${personal.surface} border-dashed px-6 py-14 text-center sm:px-12 sm:py-20`}><h2 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h2><div className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-400">{children}</div>{action && <div className="mt-7">{action}</div>}</section>;
}

export function truncateTitle(value, max = 92) {
  const title = (value || "Untitled decision").trim();
  return title.length <= max ? title : `${title.slice(0, max - 1).trimEnd()}…`;
}

export function formatDate(value) {
  if (!value) return null;
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
