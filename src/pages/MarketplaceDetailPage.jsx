import { ArrowLeft, Lock } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMarketplaceItem } from "../services/api";

export default function MarketplaceDetailPage() {
  const { itemId } = useParams(); const [item, setItem] = useState(null); const [error, setError] = useState("");
  useEffect(() => { getMarketplaceItem(itemId).then(setItem).catch(() => setError("This marketplace item is unavailable.")); }, [itemId]);
  return <section className="mx-auto max-w-3xl"><Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16}/>Marketplace</Link>{error ? <p role="alert" className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</p> : !item ? <p className="mt-8 text-slate-400">Loading item…</p> : <article className="mt-6 rounded-2xl border border-white/10 bg-white/[.03] p-6"><div className="flex items-start justify-between"><div><p className="text-sm uppercase tracking-wide text-blue-300">{item.category || item.item_type || "strategy"}</p><h1 className="mt-2 text-3xl font-semibold text-white">{item.name}</h1></div>{!item.is_public && <span className="inline-flex items-center gap-2 text-sm text-slate-400"><Lock size={15}/>Private</span>}</div>{item.description && <p className="mt-6 whitespace-pre-wrap text-slate-300">{item.description}</p>}{item.goal && <div className="mt-6 rounded-xl bg-black/20 p-4"><h2 className="font-medium text-white">Goal</h2><p className="mt-2 text-slate-400">{item.goal}</p></div>}</article>}</section>;
}
