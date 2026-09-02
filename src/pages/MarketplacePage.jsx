import { Library, Lock, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { deleteMarketplaceItem, getMarketplaceItems, getMyMarketplaceItems, saveMarketplaceItem } from "../services/api";

const initialDraft = { name: "", description: "", category: "strategy", is_public: false };

export default function MarketplacePage() {
  const [tab, setTab] = useState("public");
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState(initialDraft);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const load = useCallback(async (target = tab) => {
    setLoading(true); setError("");
    try { const response = target === "public" ? await getMarketplaceItems() : await getMyMarketplaceItems(); setItems(Array.isArray(response) ? response : []); }
    catch { setError("Marketplace items could not be loaded. Please try again."); }
    finally { setLoading(false); }
  }, [tab]);
  useEffect(() => { void Promise.resolve().then(() => load()); }, [load]);
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError("");
    try { await saveMarketplaceItem({ ...draft, data: {} }); setDraft(initialDraft); setTab("mine"); }
    catch { setError("The item could not be saved. Check the details and try again."); }
    finally { setSaving(false); }
  };
  const remove = async (id) => { try { await deleteMarketplaceItem(id); await load("mine"); } catch { setError("The item could not be deleted."); } };
  return <section className="mx-auto max-w-7xl space-y-8">
    <header><p className="text-sm font-semibold text-blue-400">Capability library</p><h1 className="mt-2 text-3xl font-semibold text-white">Marketplace</h1><p className="mt-2 max-w-2xl text-slate-400">Browse shared Aevric AI strategies and manage the items owned by your organization.</p></header>
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><div className="mb-5 flex gap-2 border-b border-white/10"><button onClick={() => setTab("public")} className={`px-3 py-2 text-sm ${tab === "public" ? "border-b-2 border-blue-400 text-white" : "text-slate-400"}`}>Public items</button><button onClick={() => setTab("mine")} className={`px-3 py-2 text-sm ${tab === "mine" ? "border-b-2 border-blue-400 text-white" : "text-slate-400"}`}>My items</button></div>
        {error && <p role="alert" className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        {loading ? <p className="py-12 text-center text-slate-400">Loading marketplace items…</p> : items.length === 0 ? <div className="py-14 text-center"><Library className="mx-auto text-slate-500"/><h2 className="mt-3 text-lg font-medium text-white">No {tab === "public" ? "public" : "personal"} items yet</h2><p className="mt-1 text-sm text-slate-400">{tab === "public" ? "Shared items will appear here when published." : "Save an item to build your organization’s library."}</p></div> : <ul className="grid gap-3 md:grid-cols-2">{items.map((item) => <li key={item.id} className="rounded-xl border border-white/10 bg-[#0b0e14] p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium text-white">{item.name}</p><p className="mt-1 text-xs uppercase tracking-wide text-blue-300">{item.category || item.item_type || "strategy"}</p></div>{!item.is_public && <Lock size={15} className="text-slate-500" aria-label="Private item"/>}</div>{item.description && <p className="mt-3 text-sm text-slate-400">{item.description}</p>}<div className="mt-4 flex items-center justify-between"><Link className="text-sm text-blue-300 hover:text-blue-200" to={`/marketplace/${item.id}`}>View details</Link>{tab === "mine" && <button aria-label={`Delete ${item.name}`} onClick={() => remove(item.id)} className="rounded p-1 text-slate-400 hover:text-red-300"><Trash2 size={16}/></button>}</div></li>)}</ul>}
      </div>
      <form onSubmit={submit} className="h-fit rounded-2xl border border-white/10 bg-white/[.03] p-5"><h2 className="flex items-center gap-2 font-medium text-white"><Plus size={18}/>Save an item</h2><label className="mt-5 block text-sm text-slate-300">Name<input required maxLength="255" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b0e14] p-2.5 text-white"/></label><label className="mt-4 block text-sm text-slate-300">Description<textarea maxLength="2000" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="mt-2 min-h-24 w-full rounded-lg border border-white/10 bg-[#0b0e14] p-2.5 text-white"/></label><label className="mt-4 block text-sm text-slate-300">Category<select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b0e14] p-2.5 text-white"><option value="strategy">Strategy</option><option value="template">Template</option><option value="simulation">Simulation</option><option value="knowledge">Knowledge</option><option value="automation">Automation</option></select></label><label className="mt-4 flex gap-2 text-sm text-slate-300"><input type="checkbox" checked={draft.is_public} onChange={(e) => setDraft({ ...draft, is_public: e.target.checked })}/>Make this item public</label><button disabled={saving} className="mt-5 w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">{saving ? "Saving…" : "Save item"}</button></form>
    </div>
  </section>;
}
