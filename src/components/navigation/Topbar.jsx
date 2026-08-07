import { Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import OrganizationSwitcher from "../organization/OrganizationSwitcher";
import WorkspaceSwitcher from "../workspace/WorkspaceSwitcher";
import ProfileMenu from "../profile/ProfileMenu";
import NotificationBell from "../notifications/NotificationBell";
import { useSession } from "../../context/SessionContext";

const pageNames = { "/dashboard": "Home", "/intelligence": "Decision Center", "/sessions": "Saved Sessions", "/organizations": "Organizations", "/workspaces": "Workspaces" };
export default function Topbar({ onOpenNavigation, menuButtonRef }) {
  const { organization, workspace, user } = useSession();
  const { pathname } = useLocation();
  return <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-[#0b0e14]/90 px-4 backdrop-blur sm:px-6"><div className="flex min-w-0 items-center gap-3"><button ref={menuButtonRef} aria-label="Open navigation" onClick={onOpenNavigation} className="rounded-lg p-2 text-slate-300 hover:bg-white/5 lg:hidden"><Menu size={20}/></button><div className="hidden border-r border-white/10 pr-4 sm:block"><p className="text-xs text-slate-500">Aura OS</p><p className="text-sm font-medium text-white">{pageNames[pathname] || "Workspace"}</p></div><OrganizationSwitcher organization={organization}/><WorkspaceSwitcher workspace={workspace}/></div><div className="flex items-center gap-2 sm:gap-3"><label className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[.04] px-3 py-2 text-sm text-slate-400 xl:flex"><Search size={15}/><input aria-label="Search Aura" className="w-36 bg-transparent outline-none placeholder:text-slate-600" placeholder="Search"/></label><NotificationBell/><ProfileMenu user={user}/></div></header>;
}
