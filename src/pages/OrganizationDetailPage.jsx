import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrganization, getOrganizationWorkspaces } from "../services/api";

export default function OrganizationDetailPage() {
  const { organizationId } = useParams(); const [organization, setOrganization] = useState(null); const [workspaces, setWorkspaces] = useState([]); const [error, setError] = useState("");
  useEffect(() => { Promise.all([getOrganization(organizationId), getOrganizationWorkspaces(organizationId)]).then(([org, spaces]) => { setOrganization(org.organization || org); setWorkspaces(spaces.workspaces || spaces || []); }).catch(() => setError("Organization not found or unavailable.")); }, [organizationId]);
  if (error) return <p role="alert" className="text-red-300">{error}</p>; if (!organization) return <p className="text-slate-400">Loading organization…</p>;
  return <section className="mx-auto max-w-5xl"><span className="text-xs uppercase tracking-wide text-blue-300">{organization.account_type}</span><h1 className="mt-2 text-3xl font-bold">{organization.account_type === "personal" ? "Personal Space" : organization.name}</h1><p className="mt-3 text-slate-400">{organization.industry || "No industry recorded"} · {organization.company_size || "Size not recorded"}</p><h2 className="mt-10 text-lg font-semibold">Workspaces</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{workspaces.map((workspace) => <div key={workspace.id} className="rounded-xl border border-white/10 p-4"><p className="font-medium">{workspace.name}</p><p className="mt-1 text-sm text-slate-400">{workspace.workspace_type}</p></div>)}</div></section>;
}
