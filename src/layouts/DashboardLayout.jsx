import Sidebar from "../components/navigation/Sidebar";
import Topbar from "../components/navigation/Topbar";
import { useRef, useState } from "react";

export default function DashboardLayout({

  children,

}) {

  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const closeNavigation = () => { setMobileNavigationOpen(false); requestAnimationFrame(() => menuButtonRef.current?.focus()); };

  return (

    <div className="flex min-h-screen bg-[#080a0f] text-slate-100">

      <Sidebar mobileOpen={mobileNavigationOpen} onClose={closeNavigation} />

      <div className="flex-1 flex flex-col overflow-hidden">

        <Topbar menuButtonRef={menuButtonRef} onOpenNavigation={() => setMobileNavigationOpen(true)} />

        <main className="flex-1 overflow-auto p-5 sm:p-8">

          {children}

        </main>

      </div>

    </div>

  );

}
