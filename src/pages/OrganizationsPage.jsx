import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrganizations } from "../services/api";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState([]); const [error, setError] = useState("");
  useEffect(() => { getOrganizations().then((data) => setOrganizations(data.organizations || data || [])).catch(() => setError("Organizations could not be loaded.")); }, []);
  return <section className="mx-auto max-w-6xl"><h1 className="text-3xl font-bold">Organizations</h1><p className="mt-2 text-slate-400">The organizations you can access in Aevric AI.</p>{error && <p role="alert" className="mt-6 text-red-300">{error}</p>}<div className="mt-8 grid gap-4 md:grid-cols-2">{organizations.map((organization) => <Link key={organization.id} to={`/organizations/${organization.id}`} className="rounded-2xl border border-white/10 bg-white/[.03] p-5 transition hover:border-blue-400"><span className="text-xs uppercase tracking-wide text-blue-300">{organization.account_type || "business"}</span><h2 className="mt-2 text-xl font-semibold">{organization.account_type === "personal" ? "Personal Space" : organization.name}</h2><p className="mt-2 text-sm text-slate-400">{organization.industry || "No industry recorded"} · {organization.company_size || "Size not recorded"}</p></Link>)}</div>{!error && organizations.length === 0 && <p className="mt-8 rounded-xl border border-dashed border-white/15 p-6 text-slate-400">No accessible organizations yet.</p>}</section>;
}
