import { useEffect, useRef, useState } from "react";

export default function ProfileMenu({ user }) {
  const [open, setOpen] = useState(false); const root = useRef(null); const trigger = useRef(null);
  const name = user?.full_name || user?.email || "Account";
  const initials = name.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const closeMenu = () => { setOpen(false); requestAnimationFrame(() => trigger.current?.focus()); };
  useEffect(() => { const close = (event) => { if (event.key === "Escape" || !root.current?.contains(event.target)) closeMenu(); }; document.addEventListener("keydown", close); document.addEventListener("mousedown", close); return () => { document.removeEventListener("keydown", close); document.removeEventListener("mousedown", close); }; }, []);
  if (!user) return null;
  return <div ref={root} className="relative"><button ref={trigger} aria-expanded={open} aria-haspopup="menu" aria-label="Open profile menu" onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[.04] px-2 py-1.5"><span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-blue-500 text-xs font-bold text-white">{initials}</span><span className="hidden max-w-28 truncate text-sm font-medium text-slate-200 sm:block">{name}</span></button>{open && <div role="menu" aria-label="Profile menu" className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-[#141a24] p-3 shadow-2xl"><p className="truncate text-sm font-medium text-white">{name}</p><p className="truncate text-xs text-slate-400">{user.email}</p></div>}</div>;
}
