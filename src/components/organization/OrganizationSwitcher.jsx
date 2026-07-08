import {

  ChevronDown,

  Building2,

} from "lucide-react";

export default function OrganizationSwitcher() {

  return (

    <button className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50 transition">

      <Building2 size={18} />

      <span>Aura Group</span>

      <ChevronDown size={16} />

    </button>

  );

}