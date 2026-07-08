import OrganizationSwitcher from "../organization/OrganizationSwitcher";
import WorkspaceSwitcher from "../workspace/WorkspaceSwitcher";
import NotificationBell from "../notifications/NotificationBell";
import ProfileMenu from "../profile/ProfileMenu";

import {

  Search,

} from "lucide-react";

export default function Topbar() {

  return (

    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">

      <div className="flex items-center gap-5">

        <div className="w-[380px] flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">

          <Search

            size={18}

            className="text-slate-400"

          />

          <input

            placeholder="Search Aura..."

            className="w-full bg-transparent outline-none"

          />

        </div>

        <OrganizationSwitcher />

        <WorkspaceSwitcher />

      </div>

      <div className="flex items-center gap-5">

        <NotificationBell />

        <ProfileMenu />

      </div>

    </header>

  );

}