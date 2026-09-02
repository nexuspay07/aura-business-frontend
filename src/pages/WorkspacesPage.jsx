import { useEffect, useState } from "react";
import { getOrganizationWorkspaces, selectActiveWorkspace } from "../services/api";
import { useSession } from "../context/SessionContext";

export default function WorkspacesPage() {
  const { organization, workspace, refreshSession } = useSession(); const [workspaces, setWorkspaces] = useState([]); const [error, setError] = useState(""); const [switching, setSwitching] = useState(null);
  useEffect(() => { if (organization?.id) getOrganizationWorkspaces(organization.id).then((data) => setWorkspaces(data.workspaces || data || [])).catch(() => setError("Workspaces could not be loaded.")); }, [organization?.id]);
  async function choose(id) { setSwitching(id); setError(""); try { await selectActiveWorkspace(id); await refreshSession(); } catch { setError("That workspace is unavailable."); } finally { setSwitching(null); } }
  return <section className="mx-auto max-w-5xl"><h1 className="text-3xl font-bold">Workspaces</h1><p className="mt-2 text-slate-400">Switching is saved to your authenticated Aevric AI context.</p>{error && <p role="alert" className="mt-5 text-red-300">{error}</p>}<div className="mt-8 grid gap-4 md:grid-cols-2">{workspaces.map((item) => <article key={item.id} className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><p className="font-semibold">{item.name}</p><p className="mt-1 text-sm text-slate-400">{item.workspace_type}</p><button disabled={item.id === workspace?.id || switching === item.id} onClick={() => choose(item.id)} className="mt-5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium disabled:opacity-50">{item.id === workspace?.id ? "Active workspace" : switching === item.id ? "Switching…" : "Switch workspace"}</button></article>)}</div></section>;
}
