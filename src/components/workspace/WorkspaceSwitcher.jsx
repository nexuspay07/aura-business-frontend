import {

  FolderTree,

  ChevronDown,

} from "lucide-react";

export default function WorkspaceSwitcher() {

  return (

    <button className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50 transition">

      <FolderTree size={18} />

      <span>Main Workspace</span>

      <ChevronDown size={16} />

    </button>

  );

}