import { BrainCircuit, Building2, LayoutDashboard, MessageSquarePlus, MessagesSquare, PanelLeftClose, Sparkles, PanelsTopLeft, Library, FlaskConical, CreditCard, Settings } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import { hasCapability } from "../../product/capabilities";

const menuItems = [
  { title: "Home", icon: LayoutDashboard, path: "/dashboard", capability: "home" },
  { title: "Decision Center", personalTitle: "Aura", icon: BrainCircuit, path: "/intelligence", capability: "ask_aura" },
  { title: "My Decisions", personalTitle: "Decisions", icon: Sparkles, path: "/decisions", capability: "decisions" },
  { title: "Conversations", icon: MessagesSquare, path: "/conversations", capability: "ask_aura" },
  { title: "Saved Sessions", icon: Sparkles, path: "/sessions", capability: "session_history" },
  { title: "Organizations", icon: Building2, path: "/organizations", capability: "organizations" },
  { title: "Workspaces", icon: PanelsTopLeft, path: "/workspaces", capability: "workspaces" },
  { title: "Marketplace", icon: Library, path: "/marketplace", capability: "marketplace" },
  { title: "Simulations", icon: FlaskConical, path: "/simulations", capability: "simulations" },
  { title: "Billing", icon: CreditCard, path: "/billing", capability: "billing" },
  { title: "Settings", icon: Settings, path: "/settings", capability: "business_settings" },
];

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const { capabilities, productMode } = useSession();
  const closeButton = useRef(null);
  const newConversation = () => { localStorage.removeItem("aura_personal_conversation_id"); onClose(); navigate("/intelligence", { state: { newConversation: Date.now() } }); };

  useLayoutEffect(() => {
    if (!mobileOpen) return undefined;
    const focusFrame = requestAnimationFrame(() => closeButton.current?.focus());
    const closeOnEscape = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => { cancelAnimationFrame(focusFrame); window.removeEventListener("keydown", closeOnEscape); };
  }, [mobileOpen, onClose]);

  return <>
    {mobileOpen && <button aria-label="Close navigation overlay" onClick={onClose} className="fixed inset-0 z-30 bg-black/60 lg:hidden" />}
    <aside aria-label="Primary navigation" className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/[.08] bg-[#0a0d13] text-slate-200 shadow-2xl transition-transform duration-200 lg:static lg:translate-x-0 lg:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className={`flex items-center justify-between px-7 ${productMode === "personal" ? "py-9" : "border-b border-white/10 py-6"}`}><div><h1 className={`${productMode === "personal" ? "text-2xl font-semibold" : "text-xl font-bold"} tracking-tight text-white`}>Aura {productMode !== "personal" && <span className="text-slate-500">OS</span>}</h1><p className={`mt-1.5 ${productMode === "personal" ? "max-w-48 text-sm leading-5 text-slate-400" : "text-xs text-slate-500"}`}>{productMode === "personal" ? "Understand, decide, and move forward." : "Intelligence operating system"}</p></div>{mobileOpen && <button ref={closeButton} aria-label="Close navigation" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"><PanelLeftClose size={20}/></button>}</div>
      <nav className={`flex-1 px-4 ${productMode === "personal" ? "py-3" : "py-6"}`}>{productMode !== "personal" && <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[.14em] text-slate-600">Operate</p>}<div className={productMode === "personal" ? "space-y-2" : "space-y-1"}>{menuItems.filter(({ capability }) => hasCapability(capabilities, capability)).map(({ title, personalTitle, icon: Icon, path }) => <NavLink key={path} to={path} onClick={onClose} className={({ isActive }) => `flex items-center rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${productMode === "personal" ? "gap-4 px-4 py-3.5 text-base" : "gap-3 px-4 py-3 text-sm"} ${isActive ? productMode === "personal" ? "bg-white/[.08] text-white" : "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:bg-white/[.045] hover:text-white"}`}><Icon size={productMode === "personal" ? 20 : 18}/>{productMode === "personal" && personalTitle ? personalTitle : title}</NavLink>)}{productMode === "personal" && <button onClick={newConversation} className="mt-2 flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left text-base font-medium text-slate-400 transition hover:bg-white/[.045] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"><MessageSquarePlus size={20}/>New Conversation</button>}</div></nav>
    </aside>
  </>;
}
