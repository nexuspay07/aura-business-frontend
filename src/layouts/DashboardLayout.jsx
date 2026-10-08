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

    <div className="aevric-shell flex min-h-screen">

      <Sidebar mobileOpen={mobileNavigationOpen} onClose={closeNavigation} />

      <div className="flex-1 flex flex-col overflow-hidden">

        <Topbar menuButtonRef={menuButtonRef} onOpenNavigation={() => setMobileNavigationOpen(true)} />

        <main className="aevric-main flex-1 overflow-auto p-5 sm:p-8">

          {children}

        </main>

      </div>

    </div>

  );

}
