import { useEffect, useRef, useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSession } from "../../context/SessionContext";

export default function ProfileMenu({ user }) {
  const { logout } = useAuth(); const { productMode } = useSession(); const navigate = useNavigate();
  const [open, setOpen] = useState(false); const root = useRef(null); const trigger = useRef(null);
  const name = user?.full_name || user?.email || "Account";
  const initials = name.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const closeMenu = () => { setOpen(false); requestAnimationFrame(() => trigger.current?.focus()); };
  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (event.key === "Escape" || !root.current?.contains(event.target)) closeMenu();
    };
    document.addEventListener("keydown", close);
    document.addEventListener("mousedown", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("mousedown", close);
    };
  }, [open]);
  if (!user) return null;
  const signOut = () => { logout(); setOpen(false); navigate("/login", { replace: true }); };
  return <div ref={root} className="relative"><button ref={trigger} aria-expanded={open} aria-haspopup="menu" aria-label="Open profile menu" onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[.04] px-2 py-1.5"><span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-blue-500 text-xs font-bold text-white">{initials}</span><span className="hidden max-w-28 truncate text-sm font-medium text-slate-200 sm:block">{name}</span></button>{open && <div role="menu" aria-label="Profile menu" className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-white/10 bg-[#141a24] p-3 shadow-2xl"><p className="truncate text-sm font-medium text-white">{name}</p><p className="truncate text-xs text-slate-400">{user.email}</p><div className="my-3 border-t border-white/10"/><Link role="menuitem" onClick={() => setOpen(false)} to={productMode === "personal" ? "/account" : "/settings"} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5"><Settings size={16}/>Settings</Link><button role="menuitem" onClick={signOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5"><LogOut size={16}/>Logout</button></div>}</div>;
}
