import { Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import OrganizationSwitcher from "../organization/OrganizationSwitcher";
import WorkspaceSwitcher from "../workspace/WorkspaceSwitcher";
import ProfileMenu from "../profile/ProfileMenu";
import NotificationBell from "../notifications/NotificationBell";
import { useSession } from "../../context/SessionContext";

  const pageNames = { "/dashboard": "Overview", "/intelligence": "Ask", "/sessions": "Saved Sessions", "/organizations": "Organizations", "/workspaces": "Workspaces", "/marketplace": "Marketplace", "/simulations": "Simulations", "/simulations/history": "Saved simulations", "/strategies": "Strategies", "/billing": "Billing", "/settings": "Settings" };
export default function Topbar({ onOpenNavigation, menuButtonRef }) {
  const { organization, workspace, user, productMode } = useSession();
  const isPersonal = productMode === "personal";
  const { pathname } = useLocation();
  return <header className="aevric-topbar sticky top-0 z-20 flex h-16 items-center justify-between px-4 backdrop-blur sm:px-6"><div className="flex min-w-0 items-center gap-3"><button ref={menuButtonRef} aria-label="Open navigation" onClick={onOpenNavigation} className="icon-button lg:hidden"><Menu size={20}/></button>{!isPersonal && <><div className="hidden border-r pr-4 sm:block"><p className="text-xs text-slate-500">Aevric AI</p><p className="text-sm font-medium">{pageNames[pathname] || "Workspace"}</p></div><OrganizationSwitcher organization={organization}/><WorkspaceSwitcher workspace={workspace}/></>}</div><div className="flex items-center gap-2 sm:gap-3">{!isPersonal && <><label className="topbar-search hidden items-center gap-2 px-3 py-2 text-sm xl:flex"><Search size={15}/><input aria-label="Search Aevric AI" className="w-36 bg-transparent outline-none" placeholder="Search"/></label><NotificationBell/></>}<ProfileMenu user={user}/></div></header>;
}
