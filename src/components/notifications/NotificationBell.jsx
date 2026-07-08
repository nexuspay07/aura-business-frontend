import {

  Bell,

} from "lucide-react";

export default function NotificationBell() {

  return (

    <button className="relative rounded-2xl border border-slate-200 bg-white p-3 hover:bg-slate-50 transition">

      <Bell size={20} />

      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>

    </button>

  );

}