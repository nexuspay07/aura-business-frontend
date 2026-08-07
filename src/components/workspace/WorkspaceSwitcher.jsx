import { FolderTree } from "lucide-react";

export default function WorkspaceSwitcher({ workspace }) {
  if (!workspace?.name) return null;
  return <div aria-label={`Current workspace: ${workspace.name}`} className="hidden min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[.04] px-3 py-2 text-left md:flex"><FolderTree size={16} className="shrink-0 text-blue-300"/><div className="min-w-0"><p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Workspace</p><p className="truncate text-sm font-medium text-slate-100">{workspace.name}</p></div></div>;
}
