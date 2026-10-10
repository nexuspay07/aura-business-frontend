import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createStrategyStressTest } from "../../services/api";
import { createIdempotencyKey } from "../../services/idempotency";

const emptyScenario = () => ({ key: "", name: "", description: "", changed_conditions: [""], qualitative_severity: "" });
const messageFor = error => {
  const status = error?.response?.status; const code = error?.response?.data?.detail?.code;
  if (code === "simulation_creation_in_progress") return "This stress test is already being created. Try again shortly.";
  if (status === 409) return "This retry does not match the original stress test request. Start a new stress test to continue.";
  if (status === 422) return "Review the scenario details and correct the highlighted input.";
  if (status === 404) return "This Strategy is not available in your current workspace.";
  if (status === 502) return "The analysis could not be generated. You can safely retry this same stress test.";
  if (status === 503) return "Simulation Intelligence is temporarily unavailable. You can safely retry shortly.";
  return "The stress test could not be completed. You can safely retry this same request.";
};

export default function StressTestDialog({ strategy, onClose, onCreated, returnFocusRef }) {
  const [title, setTitle] = useState(`${strategy.title || "Strategy"} stress test`);
  const [scenarios, setScenarios] = useState([emptyScenario()]);
  const [assumptions, setAssumptions] = useState([]);
  const [error, setError] = useState(""); const [submitting, setSubmitting] = useState(false);
  const submission = useRef(null); const pending = useRef(false); const dialog = useRef(null);
  const changed = () => { submission.current = null; setError(""); };

  useEffect(() => {
    const previousFocus = returnFocusRef?.current || document.activeElement;
    const focusFrame = requestAnimationFrame(() => dialog.current?.querySelector("input")?.focus());
    const keyboard = event => {
      if (event.key === "Escape" && !pending.current) { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab" || !dialog.current) return;
      const focusable = [...dialog.current.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) { event.preventDefault(); dialog.current.focus(); return; }
      const first = focusable[0]; const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keyboard);
    return () => { cancelAnimationFrame(focusFrame); document.removeEventListener("keydown", keyboard); requestAnimationFrame(() => previousFocus?.isConnected && previousFocus.focus()); };
  }, [onClose, returnFocusRef]);
  const updateScenario = (index, field, value) => { changed(); setScenarios(items => items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item)); };
  const updateCondition = (scenarioIndex, conditionIndex, value) => { changed(); setScenarios(items => items.map((item, itemIndex) => itemIndex === scenarioIndex ? { ...item, changed_conditions: item.changed_conditions.map((condition, index) => index === conditionIndex ? value : condition) } : item)); };
  const addCondition = scenarioIndex => { changed(); setScenarios(items => items.map((item, itemIndex) => itemIndex === scenarioIndex && item.changed_conditions.length < 20 ? { ...item, changed_conditions: [...item.changed_conditions, ""] } : item)); };
  const removeCondition = (scenarioIndex, conditionIndex) => { changed(); setScenarios(items => items.map((item, itemIndex) => itemIndex === scenarioIndex && item.changed_conditions.length > 1 ? { ...item, changed_conditions: item.changed_conditions.filter((_, index) => index !== conditionIndex) } : item)); };
  const addScenario = () => { changed(); setScenarios(items => [...items, emptyScenario()]); };
  const removeScenario = index => { changed(); setScenarios(items => items.filter((_, itemIndex) => itemIndex !== index)); };
  const addAssumption = () => { changed(); setAssumptions(items => [...items, { text: "", scenario_key: "" }]); };

  async function submit(event) {
    event.preventDefault(); if (pending.current) return;
    const normalized = { title: title.trim(), scenarios: scenarios.map(item => ({ ...item, key: item.key.trim(), name: item.name.trim(), description: item.description.trim(), changed_conditions: item.changed_conditions.map(value => value.trim()).filter(Boolean), ...(item.qualitative_severity ? {} : { qualitative_severity: undefined }) })), user_assumptions: assumptions.filter(item => item.text.trim()).map(item => ({ text: item.text.trim(), ...(item.scenario_key ? { scenario_key: item.scenario_key } : {}) })) };
    if (!normalized.title || normalized.scenarios.some(item => !item.key || !item.name || !item.description || !item.changed_conditions.length)) { setError("Complete each scenario, including at least one changed condition."); return; }
    const signature = JSON.stringify(normalized); if (!submission.current || submission.current.signature !== signature) submission.current = { signature, key: createIdempotencyKey() };
    pending.current = true; setSubmitting(true); setError("");
    try { onCreated(await createStrategyStressTest(strategy.public_id, normalized, submission.current.key)); submission.current = null; }
    catch (requestError) { setError(messageFor(requestError)); }
    finally { pending.current = false; setSubmitting(false); }
  }

  return <div className="dialog-backdrop"><section ref={dialog} role="dialog" aria-modal="true" aria-labelledby="stress-test-title" aria-describedby="stress-test-description" tabIndex={-1} className="stress-dialog">
    <header><div><p className="capability-label simulation">Simulation Intelligence</p><h2 id="stress-test-title">Stress Test Strategy</h2><p id="stress-test-description">Define the conditions you want Aevric to compare. Scenarios are explicit and remain under your control.</p></div><button type="button" aria-label="Close stress test" className="icon-button" disabled={submitting} onClick={onClose}><X/></button></header>
    <form onSubmit={submit}><label className="field"><span>Stress test title</span><input value={title} maxLength={255} disabled={submitting} onChange={event => { changed(); setTitle(event.target.value); }}/></label>
      <div className="form-section-heading"><div><h3>Scenarios</h3><p>Examples: demand falls, costs increase, timeline slips, resources improve.</p></div>{scenarios.length < 6 && <button type="button" className="button ghost" onClick={addScenario}><Plus size={16}/>Add scenario</button>}</div>
      <div className="scenario-editor-list">{scenarios.map((scenario, index) => <fieldset disabled={submitting} className="scenario-editor" key={index}><legend>Scenario {index + 1}</legend>{scenarios.length > 1 && <button type="button" aria-label={`Remove scenario ${index + 1}`} className="remove-button" onClick={() => removeScenario(index)}><Trash2 size={16}/></button>}<div className="field-grid"><label className="field"><span>Stable key</span><input required pattern="[a-z][a-z0-9_-]{0,63}" placeholder="cost_increase" value={scenario.key} onChange={event => updateScenario(index, "key", event.target.value)}/><small>Lowercase letters, numbers, underscores, or hyphens.</small></label><label className="field"><span>Name</span><input required placeholder="Costs increase" value={scenario.name} onChange={event => updateScenario(index, "name", event.target.value)}/></label></div><label className="field"><span>Description</span><textarea required rows="3" value={scenario.description} onChange={event => updateScenario(index, "description", event.target.value)}/></label><div className="field"><span>Changed conditions</span><div className="condition-editor-list">{scenario.changed_conditions.map((condition, conditionIndex) => <div className="condition-editor" key={conditionIndex}><label><span className="sr-only">Changed condition {conditionIndex + 1}</span><input required aria-label={`Changed condition ${conditionIndex + 1}`} placeholder="Supplier costs rise by a meaningful amount" value={condition} onChange={event => updateCondition(index, conditionIndex, event.target.value)}/></label>{scenario.changed_conditions.length > 1 && <button type="button" aria-label={`Remove changed condition ${conditionIndex + 1}`} className="icon-button" onClick={() => removeCondition(index, conditionIndex)}><Trash2 size={16}/></button>}</div>)}</div>{scenario.changed_conditions.length < 20 && <button type="button" className="button ghost condition-add" onClick={() => addCondition(index)}><Plus size={16}/>Add changed condition</button>}<small>{scenario.changed_conditions.length} of 20 conditions</small></div><label className="field"><span>Qualitative severity</span><select value={scenario.qualitative_severity} onChange={event => updateScenario(index, "qualitative_severity", event.target.value)}><option value="">Not specified</option><option value="LOW">Low</option><option value="MODERATE">Moderate</option><option value="HIGH">High</option></select></label></fieldset>)}</div>
      <div className="form-section-heading"><div><h3>Optional assumptions</h3><p>Record anything the analysis should treat as given.</p></div><button type="button" className="button ghost" onClick={addAssumption}><Plus size={16}/>Add assumption</button></div>
      {assumptions.map((item, index) => <div className="assumption-editor" key={index}><label className="field"><span>Assumption {index + 1}</span><input value={item.text} onChange={event => { changed(); setAssumptions(values => values.map((value, itemIndex) => itemIndex === index ? { ...value, text: event.target.value } : value)); }}/></label><label className="field"><span>Related scenario</span><select value={item.scenario_key} onChange={event => { changed(); setAssumptions(values => values.map((value, itemIndex) => itemIndex === index ? { ...value, scenario_key: event.target.value } : value)); }}><option value="">All scenarios</option>{scenarios.filter(item => item.key).map(item => <option key={item.key} value={item.key}>{item.name || item.key}</option>)}</select></label></div>)}
      {error && <p role="alert" className="form-error">{error}</p>}<footer><button type="button" className="button secondary" disabled={submitting} onClick={onClose}>Cancel</button><button type="submit" className="button simulation-primary" disabled={submitting} aria-busy={submitting}>{submitting ? "Stress-testing your strategy..." : error ? "Retry stress test" : "Create stress test"}</button></footer>{submitting && <p role="status" className="submission-note">Comparing how the strategy responds across your scenarios.</p>}
    </form>
  </section></div>;
}
