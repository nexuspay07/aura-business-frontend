import { LoaderCircle, MessageSquarePlus, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { askAura, getAuraConversation, savePersonalDecision } from "../../services/api";
import { personal } from "./PersonalUI";
import AuraResponseRenderer from "./AuraResponseRenderer";

const SESSION_KEY = "aura_personal_conversation_id";
const prompts = ["Explain compound interest simply.", "Help me write an email.", "Should I take this job offer?", "Should I go back to school?"];
const turn = (role, content, mode, payload) => ({ role, content, mode, ...(payload ? { payload } : {}) });
const internalEvidence = /^(?:user-query|derived:[\w.-]+|document(?:-chunk)?:[\w.-]+|memory:[\w.-]+)$/i;
const consumerText = (value = "") => String(value).replace(/\[([^\]]+)\]/g, (marker, contents) => {
  const ids = contents.split(",").map((item) => item.trim()).filter(Boolean);
  return ids.length && ids.every((item) => internalEvidence.test(item)) ? "" : marker;
}).replace(/\s+([,.;:!?])/g, "$1").replace(/\s{2,}/g, " ").trim();
const comparableText = (value) => consumerText(value).toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
const substantiallySame = (left, right) => {
  const a = comparableText(left); const b = comparableText(right);
  if (!a || !b) return false;
  if (a === b || (Math.min(a.length, b.length) >= 60 && (a.includes(b) || b.includes(a)))) return true;
  const aWords = new Set(a.split(" ")); const bWords = new Set(b.split(" "));
  const shared = [...aWords].filter((word) => bWords.has(word)).length;
  return shared / Math.min(aWords.size, bWords.size) >= 0.82;
};
const financialText = (value) => consumerText(value).replace(/Monthly budget appears able to absorb ownership costs better given a (\$[\d,]+) surplus\.?/gi, "You currently have a $1 monthly surplus before any additional car-related costs.");
const actionText = (value) => {
  const clean = financialText(value); if (!clean) return clean;
  return /^(?:set|compare|check|confirm|verify|review|calculate|identify|ask|contact|gather|choose|decide|wait|keep|revisit|research|request|list|test|discuss|schedule|save|apply|enroll|buy|avoid|determine|estimate|validate)\b/i.test(clean)
    ? clean : `Check whether ${clean.charAt(0).toLowerCase()}${clean.slice(1).replace(/[.!?]+$/, "")}.`;
};
const list = (items, transform = financialText) => items?.length ? <ul className="mt-3 space-y-2 text-slate-300">{items.map((item, index) => { const text = transform(item); return text ? <li key={`${text}-${index}`}>• {text}</li> : null; })}</ul> : null;
function DecisionTurn({ decision }) {
  const recommendation = decision.recommendation || {};
  const duplicateReasoning = substantiallySame(recommendation.rationale, decision.analysis);
  return <div className="mt-6 space-y-7 border-t border-white/10 pt-6">
    <section><span className="sr-only">Aevric AI recommends</span><p className="text-sm font-semibold uppercase tracking-[.12em] text-blue-300">Recommendation</p><p className="mt-2 text-2xl font-semibold text-white">{financialText(recommendation.recommended_option)}</p>{recommendation.rationale && !duplicateReasoning && <p className="mt-3 max-w-3xl leading-7 text-slate-300">{financialText(recommendation.rationale)}</p>}</section>
    {decision.analysis && <section><h3 className="font-semibold text-white">Why</h3><p className="mt-2 max-w-3xl leading-7 text-slate-300">{financialText(decision.analysis)}</p></section>}
    {decision.alternatives?.length > 0 && <section><h3 className="font-semibold text-white">Options and trade-offs</h3><div className="mt-3 space-y-4">{decision.alternatives.map((option) => <div key={option.option}><p className="font-medium text-slate-100">{financialText(option.option)}</p>{list([...(option.benefits || []), ...(option.downsides || []).map((item) => `Trade-off: ${item}`)])}</div>)}</div></section>}
    {decision.unresolved_questions?.length > 0 && <section><h3 className="font-semibold text-white">What I'm not sure about</h3>{list(decision.unresolved_questions)}</section>}
    {(recommendation.what_would_change_the_recommendation || decision.what_would_change_recommendation)?.length > 0 && <section><h3 className="font-semibold text-white">What could change this</h3>{list(recommendation.what_would_change_the_recommendation || decision.what_would_change_recommendation)}</section>}
    {decision.prioritized_actions?.length > 0 && <section><h3 className="font-semibold text-white">Next steps</h3>{list(decision.prioritized_actions, actionText)}</section>}
  </div>;
}

function CurrentSources({ sources = [] }) {
  const safe = sources.filter((source) => { try { return new URL(source.url).protocol === "https:"; } catch { return false; } });
  if (!safe.length) return null;
  return <section className="mt-8 border-t border-white/10 pt-6"><h3 className="text-sm font-semibold uppercase tracking-[.12em] text-slate-400">Sources</h3><div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2">{safe.map((source) => <a id={`aura-source-${source.id}`} key={`${source.id}-${source.url}`} href={source.url} target="_blank" rel="noopener noreferrer" className={`min-w-0 scroll-mt-24 rounded-2xl border border-white/10 bg-white/[.025] p-4 transition hover:border-blue-300/30 sm:p-5 ${personal.focus}`}><span className="mb-3 inline-flex min-h-7 min-w-7 items-center justify-center rounded-lg bg-blue-300/10 px-2 text-xs font-semibold text-blue-200" aria-hidden="true">{source.id}</span><span className="block break-words font-medium leading-6 text-slate-100">{consumerText(source.title)}</span><span className="mt-2 block break-words text-xs text-slate-500">{source.domain}</span>{source.published_at && <time className="mt-2 block text-xs text-slate-500">Published {new Date(source.published_at).toLocaleDateString()}</time>}<span className="mt-3 block text-sm font-semibold text-blue-300">Open source</span></a>)}</div></section>;
}

function AuraTurn({ turn }) {
  const decision = turn.mode === "ANALYSIS_COMPLETE" ? turn.payload : null;
  const current = turn.mode === "CURRENT_COMPLETE";
  return <article className={turn.role === "user" ? "ml-auto max-w-3xl rounded-3xl bg-blue-500 px-5 py-4 text-white sm:px-6" : "mr-auto max-w-4xl px-1 py-3 text-slate-200 sm:px-2"}>
    <p className={`text-xs font-semibold uppercase tracking-[.14em] ${turn.role === "user" ? "text-blue-100" : "text-blue-300"}`}>{turn.role === "user" ? "You" : "Aevric AI"}</p>
    {current && <p className="mt-2 text-xs font-semibold uppercase tracking-[.14em] text-emerald-300">Current · verified sources</p>}
    {turn.mode === "CLARIFICATION_REQUIRED" && <h3 className="mt-2 text-lg font-semibold text-white">Before I recommend something, I need to know…</h3>}
    {!(decision && consumerText(turn.content) === consumerText(decision.recommendation?.recommended_option)) && <AuraResponseRenderer content={turn.content} mode={turn.mode} sources={turn.payload?.sources || []}/>} 
    {turn.mode === "CLARIFICATION_REQUIRED" && turn.payload?.questions?.length > 1 && list(turn.payload.questions.slice(1))}
    {decision && <DecisionTurn decision={decision}/>} 
    {turn.role === "assistant" && <CurrentSources sources={turn.payload?.sources}/>} 
  </article>;
}

export default function PersonalAskExperience() {
  const location = useLocation();
  const [initialSessionId] = useState(() => Number(location.state?.conversationId || localStorage.getItem(SESSION_KEY)) || null);
  const [message, setMessage] = useState(location.state?.suggestedPrompt || "");
  const [result, setResult] = useState(null); const [turns, setTurns] = useState([]); const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false); const [restoring, setRestoring] = useState(Boolean(initialSessionId)); const [error, setError] = useState("");
  const [saved, setSaved] = useState(null); const [saving, setSaving] = useState(false); const endRef = useRef(null);

  useEffect(() => { const stored = initialSessionId; if (!stored) return;
    getAuraConversation(stored).then((conversation) => { setSessionId(conversation.session_id); setTurns(conversation.turns || []); setResult(conversation.decision || { mode: conversation.mode, classification: conversation.classification, questions: conversation.questions || [] }); }).catch(() => localStorage.removeItem(SESSION_KEY)).finally(() => setRestoring(false));
  }, [initialSessionId]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [turns]);

  async function submit(event) { event.preventDefault(); const text = message.trim(); if (!text || loading) return; setLoading(true); setError(""); try {
    const response = await askAura(result?.mode === "CLARIFICATION_REQUIRED" ? { session_id: sessionId, clarification_response: text } : sessionId ? { session_id: sessionId, message: text } : { message: text });
    const compatibleTurns = response.turns || [turn("user", text, "USER"), turn("assistant", response.message || response.questions?.[0] || response.recommendation?.recommended_option || "Aevric AI completed the request.", response.mode, response.mode === "ANALYSIS_COMPLETE" ? response : response.mode?.startsWith("CURRENT_") ? { sources: response.sources || [] } : response.questions ? { questions: response.questions } : undefined)];
    setResult(response); setTurns(compatibleTurns); setSessionId(response.session_id); localStorage.setItem(SESSION_KEY, String(response.session_id)); setMessage("");
  } catch (requestError) { setError(({ 503: "Aevric AI is temporarily unavailable. Please try again shortly.", 504: "Aevric AI needs a little more time. Please try again.", 422: "Aevric AI couldn't produce a reliable answer from the available information." })[requestError?.response?.status] || "Aevric AI couldn't complete that request. Please try again."); } finally { setLoading(false); } }
  function keyDown(event) { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }
  async function saveDecision() { if (result?.mode !== "ANALYSIS_COMPLETE" || !sessionId || saving || saved) return; setSaving(true); setError(""); try { setSaved(await savePersonalDecision({ source_session_id: sessionId, decision_type: result.classification })); } catch (requestError) { setError(requestError?.response?.status === 409 ? "This decision is already saved." : "Aevric AI couldn't save this decision. Please try again."); } finally { setSaving(false); } }
  const clarification = result?.mode === "CLARIFICATION_REQUIRED";

  return <div className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-5xl flex-col px-1">
    {turns.length === 0 && !restoring && <header className="pb-8 pt-7 text-center sm:pb-10 sm:pt-12"><div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300"><Sparkles size={17}/>Aevric AI</div><h1 className={`${personal.hero} mx-auto mt-5 max-w-4xl`}>What's on your mind?</h1><p className={`${personal.body} mx-auto mt-4 max-w-2xl`}>Aevric AI helps you understand, decide, and move forward.</p></header>}
    {restoring && <p role="status" className="flex flex-1 items-center justify-center gap-2 text-slate-400"><LoaderCircle className="animate-spin" size={17}/>Restoring your conversation…</p>}
    {turns.length > 0 && <><div className="flex justify-end pb-3"><button type="button" onClick={() => { localStorage.removeItem(SESSION_KEY); setTurns([]); setResult(null); setSessionId(null); setSaved(null); setMessage(""); }} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm text-slate-300 hover:bg-white/5 ${personal.focus}`}><MessageSquarePlus size={17}/>New Conversation</button></div><section aria-live="polite" aria-label="Conversation" className="flex-1 space-y-5 pb-8 pt-3">{turns.map((turn, index) => <AuraTurn key={`${turn.created_at || "turn"}-${index}`} turn={turn}/>)}<div ref={endRef}/></section></>}
    {result?.mode === "ANALYSIS_COMPLETE" && <div className="mb-4 px-2">{saved ? <p role="status" className="text-sm text-emerald-200">Decision saved. Saved to Decisions · <Link className="underline underline-offset-4" to={`/decisions/${saved.id}`}>View decision</Link></p> : <button onClick={saveDecision} disabled={saving} className={`text-sm font-semibold text-blue-300 hover:text-blue-200 disabled:opacity-50 ${personal.focus}`}>{saving ? "Saving…" : "Save Decision"}</button>}</div>}
    <form onSubmit={submit} className="sticky bottom-0 rounded-[28px] border border-white/10 bg-[#0d121b]/95 p-3 shadow-2xl shadow-black/30 backdrop-blur sm:p-4"><label className="sr-only" htmlFor="ask-aura-message">Message Aevric AI</label><textarea id="ask-aura-message" value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={keyDown} disabled={loading || restoring} placeholder="Talk to Aevric AI..." rows={turns.length ? 3 : 6} className="w-full resize-none rounded-2xl border-0 bg-transparent px-4 py-3 text-lg leading-8 text-slate-100 outline-none placeholder:text-slate-600 focus:ring-1 focus:ring-blue-300/60 disabled:opacity-60 sm:px-5"/><div className="flex items-center justify-between gap-4 px-3 pb-1 pt-2"><div><p className="text-xs text-slate-500">Enter to send · Shift+Enter for a new line</p><p className="mt-1 text-xs text-slate-600">Aevric AI can make mistakes. Verify important information.</p></div><button type="submit" disabled={!message.trim() || loading || restoring} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-400 disabled:opacity-40 ${personal.focus}`}><Send size={17}/>{loading ? "Thinking…" : clarification ? "Continue" : "Send"}</button></div>{loading && <p role="status" className="mx-3 mt-2 flex items-center gap-2 border-t border-white/[.07] py-3 text-sm text-blue-200"><LoaderCircle className="animate-spin" size={16}/>Aevric AI is thinking…</p>}{error && <p role="alert" className="mx-3 mt-2 border-t border-white/[.07] py-3 text-sm text-red-200">{error}</p>}</form>
    {turns.length === 0 && !restoring && <section className="pb-8 pt-6"><p className={personal.eyebrow}>Try asking</p><div className="mt-3 flex flex-wrap gap-3">{prompts.map((prompt) => <button key={prompt} type="button" onClick={() => setMessage(prompt)} className={`rounded-full border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:border-white/20 ${personal.focus}`}>{prompt}</button>)}</div></section>}
  </div>;
}
