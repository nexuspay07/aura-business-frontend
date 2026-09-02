import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import api from "../services/api";
import ExecutiveReport from "../components/intelligence/ExecutiveReport";
import PersonalAsk from "../components/personal/PersonalAskExperience";
import { useSession } from "../context/SessionContext";
import { useLocation } from "react-router-dom";

export default function AuraCommandCenter() {
  const { productMode } = useSession();
  const location = useLocation();
  if (productMode === "personal") return <PersonalAsk key={location.state?.newConversation || location.state?.conversationId || "active"} />;
  return <ExecutiveCommandCenter />;
}

function ExecutiveCommandCenter() {
  const [prompt, setPrompt] = useState("");
  const [report, setReport] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!prompt.trim() || loading) return;
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/chat", {
        message: prompt.trim(),
        session_id: sessionId,
      });
      setSessionId(data.session_id ?? null);
      setReport(data.executive_report || null);
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Aevric AI could not complete this intelligence request.");
    } finally { setLoading(false); }
  }

  return <div className="mx-auto max-w-7xl space-y-6 p-1">
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><span className="rounded-xl bg-violet-100 p-2 text-violet-700"><Sparkles size={20}/></span><div><h1 className="text-xl font-bold text-slate-900">Executive Intelligence Workspace</h1><p className="text-sm text-slate-500">Decision-ready analysis grounded in Aevric AI’s existing intelligence pipeline.</p></div></div><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Describe the executive decision, strategic opportunity, or operating challenge…" className="mt-5 min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"/><div className="mt-4 flex items-center justify-between gap-3"><p className="text-xs text-slate-500">Report includes strategy, risks, roadmap, KPIs, assumptions, and pipeline sources.</p><button onClick={handleAnalyze} disabled={loading || !prompt.trim()} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800 disabled:opacity-50"><Send size={16}/>{loading ? "Preparing report…" : "Generate report"}</button></div>{error && <p className="mt-3 text-sm text-red-600">{error}</p>}</section>
    <ExecutiveReport report={report} />
  </div>;
}
