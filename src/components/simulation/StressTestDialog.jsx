import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createStrategyStressTest } from "../../services/api";
import { createIdempotencyKey } from "../../services/idempotency";
import {
  MAX_ASSUMPTIONS, MAX_SCENARIOS, MAX_TEXT_LENGTH, SCENARIO_PRESETS,
  SEVERITY_OPTIONS, normalizeStressTestRequest, strategyScenarioSuggestions,
  stressTestRequestSignature,
} from "./stressTestForm";

const newScenario = id => ({ id, choice: "", customName: "", details: "", severity: "" });
const messageFor = error => {
  const status = error?.response?.status; const code = error?.response?.data?.detail?.code;
  if (code === "simulation_creation_in_progress") return "This stress test is already being created. Try again shortly.";
  if (status === 409) return "This retry does not match the original stress test request. Start a new stress test to continue.";
  if (status === 422) return "Review the change details and correct the highlighted input.";
  if (status === 404) return "This Strategy is not available in your current workspace.";
  if (status === 502) return "The analysis could not be generated. You can safely retry this same stress test.";
  if (status === 503) return "Simulation Intelligence is temporarily unavailable. You can safely retry shortly.";
  return "The stress test could not be completed. You can safely retry this same request.";
};

export default function StressTestDialog({ strategy, onClose, onCreated, returnFocusRef }) {
  const nextScenarioId = useRef(2); const nextAssumptionId = useRef(1);
  const [title, setTitle] = useState(`${strategy.title || "Strategy"} stress test`);
  const [scenarios, setScenarios] = useState([newScenario("scenario-1")]);
  const [assumptions, setAssumptions] = useState([]);
  const [error, setError] = useState(""); const [validationErrors, setValidationErrors] = useState([]); const [submitting, setSubmitting] = useState(false);
  const submission = useRef(null); const pending = useRef(false); const dialog = useRef(null);
  const suggestions = strategyScenarioSuggestions(strategy.strategy);
  const changed = () => { setError(""); setValidationErrors([]); };
  const fieldError = field => validationErrors.find(item => item.field === field)?.message;

  useEffect(() => {
    const previousFocus = returnFocusRef?.current || document.activeElement;
    const focusFrame = requestAnimationFrame(() => dialog.current?.querySelector("select")?.focus());
    const keyboard = event => {
      if (event.key === "Escape" && !pending.current) { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab" || !dialog.current) return;
      const focusable = [...dialog.current.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), summary, [href], [tabindex]:not([tabindex="-1"])')].filter(item => item.offsetParent !== null);
      if (!focusable.length) { event.preventDefault(); dialog.current.focus(); return; }
      const first = focusable[0]; const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keyboard);
    return () => { cancelAnimationFrame(focusFrame); document.removeEventListener("keydown", keyboard); requestAnimationFrame(() => previousFocus?.isConnected && previousFocus.focus()); };
  }, [onClose, returnFocusRef]);

  const updateScenario = (index, changes) => { changed(); setScenarios(items => items.map((item, itemIndex) => itemIndex === index ? { ...item, ...changes } : item)); };
  const chooseScenario = (index, choice) => {
    const suggestion = choice.startsWith("strategy:") ? suggestions[Number(choice.split(":")[1])] : null;
    updateScenario(index, { choice, customName: "", details: suggestion?.details || "" });
  };
  const addScenario = () => { changed(); setScenarios(items => items.length < MAX_SCENARIOS ? [...items, newScenario(`scenario-${nextScenarioId.current++}`)] : items); };
  const removeScenario = index => {
    changed(); const removedId = scenarios[index]?.id;
    setScenarios(items => items.filter((_, itemIndex) => itemIndex !== index));
    setAssumptions(items => items.map(item => item.scenarioId === removedId ? { ...item, scenarioId: "" } : item));
  };
  const addAssumption = () => { changed(); setAssumptions(items => items.length < MAX_ASSUMPTIONS ? [...items, { id: `assumption-${nextAssumptionId.current++}`, text: "", scenarioId: "" }] : items); };
  const removeAssumption = index => { changed(); setAssumptions(items => items.filter((_, itemIndex) => itemIndex !== index)); };
  const updateAssumption = (index, changes) => { changed(); setAssumptions(items => items.map((item, itemIndex) => itemIndex === index ? { ...item, ...changes } : item)); };
  const scenarioLabel = item => {
    const preset = SCENARIO_PRESETS.find(option => option.id === item.choice);
    if (preset) return preset.name;
    if (item.choice.startsWith("strategy:")) return suggestions[Number(item.choice.split(":")[1])]?.name || "Strategy change";
    return item.customName.trim() || "Custom change";
  };

  async function submit(event) {
    event.preventDefault(); if (pending.current) return;
    let normalized;
    try { normalized = normalizeStressTestRequest({ title, scenarios, assumptions }, strategy.strategy); }
    catch (formError) {
      const errors = formError.validationErrors || [];
      setValidationErrors(errors); setError("Please complete the highlighted fields.");
      requestAnimationFrame(() => document.getElementById(errors[0]?.field)?.focus()); return;
    }
    const signature = stressTestRequestSignature(normalized);
    if (!submission.current || submission.current.signature !== signature) submission.current = { signature, key: createIdempotencyKey() };
    pending.current = true; setSubmitting(true); setError(""); setValidationErrors([]);
    try { onCreated(await createStrategyStressTest(strategy.public_id, normalized, submission.current.key)); submission.current = null; }
    catch (requestError) { setError(messageFor(requestError)); }
    finally { pending.current = false; setSubmitting(false); }
  }

  return <div className="dialog-backdrop"><section ref={dialog} role="dialog" aria-modal="true" aria-labelledby="stress-test-title" aria-describedby="stress-test-description" aria-busy={submitting} tabIndex={-1} className="stress-dialog simplified-stress-dialog">
    <header><div><p className="capability-label simulation">Simulation Intelligence</p><h2 id="stress-test-title">Stress Test Strategy</h2><p id="stress-test-description">Describe what could change. Aevric will assess how the Strategy might respond without treating the result as a forecast.</p></div><button type="button" aria-label="Close stress test" className="icon-button" disabled={submitting} onClick={onClose}><X aria-hidden="true"/></button></header>
    <form onSubmit={submit} noValidate>
      <div className="scenario-editor-list">{scenarios.map((scenario, index) => {
        const choiceError = fieldError(`scenario-choice-${index}`); const nameError = fieldError(`scenario-name-${index}`); const detailsError = fieldError(`scenario-details-${index}`); const severityError = fieldError(`scenario-severity-${index}-LOW`);
        return <fieldset disabled={submitting} className="scenario-editor plain-scenario-editor" key={scenario.id}><legend>{scenarios.length === 1 ? "Potential change" : `Change ${index + 1}`}</legend>{scenarios.length > 1 && <button type="button" aria-label={`Remove change ${index + 1}`} className="remove-button" onClick={() => removeScenario(index)}><Trash2 aria-hidden="true" size={17}/></button>}
          <label className="field" htmlFor={`scenario-choice-${index}`}><span>What might change?</span><select id={`scenario-choice-${index}`} value={scenario.choice} aria-invalid={Boolean(choiceError)} aria-describedby={choiceError ? `scenario-choice-error-${index}` : undefined} onChange={event => chooseScenario(index, event.target.value)}><option value="">Choose a change</option><optgroup label="Common changes">{SCENARIO_PRESETS.map(option => <option value={option.id} key={option.id}>{option.name}</option>)}</optgroup>{suggestions.length > 0 && <optgroup label="From this Strategy">{suggestions.map((option, suggestionIndex) => <option value={`strategy:${suggestionIndex}`} key={option.id}>{option.name}</option>)}</optgroup>}<option value="custom">Something else</option></select>{choiceError && <small className="field-error" id={`scenario-choice-error-${index}`}>{choiceError}</small>}</label>
          {scenario.choice === "custom" && <label className="field" htmlFor={`scenario-name-${index}`}><span>Name this change</span><input id={`scenario-name-${index}`} value={scenario.customName} maxLength={MAX_TEXT_LENGTH} aria-invalid={Boolean(nameError)} aria-describedby={nameError ? `scenario-name-error-${index}` : undefined} onChange={event => updateScenario(index, { customName: event.target.value })}/>{nameError && <small className="field-error" id={`scenario-name-error-${index}`}>{nameError}</small>}</label>}
          <label className="field" htmlFor={`scenario-details-${index}`}><span>Describe what would happen</span><textarea id={`scenario-details-${index}`} rows="4" maxLength={MAX_TEXT_LENGTH} placeholder="For example: I have to pay an additional $1,000 from my savings after buying the laptop." value={scenario.details} aria-invalid={Boolean(detailsError)} aria-describedby={`scenario-details-help-${index}${detailsError ? ` scenario-details-error-${index}` : ""}`} onChange={event => updateScenario(index, { details: event.target.value })}/><small id={`scenario-details-help-${index}`}>Include the circumstances that would materially change the Strategy.</small>{detailsError && <small className="field-error" id={`scenario-details-error-${index}`}>{detailsError}</small>}</label>
          <fieldset className="severity-field" aria-invalid={Boolean(severityError)} aria-describedby={severityError ? `scenario-severity-error-${index}` : undefined}><legend>How significant would this be?</legend><div className="severity-options">{SEVERITY_OPTIONS.map(option => <label key={option.value}><input id={`scenario-severity-${index}-${option.value}`} type="radio" name={`scenario-severity-${scenario.id}`} value={option.value} checked={scenario.severity === option.value} onChange={event => updateScenario(index, { severity: event.target.value })}/><span>{option.label}</span></label>)}</div>{severityError && <small className="field-error" id={`scenario-severity-error-${index}`}>{severityError}</small>}</fieldset>
        </fieldset>;
      })}</div>
      {scenarios.length < MAX_SCENARIOS && <button type="button" className="button ghost add-change" disabled={submitting} onClick={addScenario}><Plus aria-hidden="true" size={16}/>Add another change</button>}
      <details className="advanced-options"><summary>Advanced options <span>Optional</span></summary><fieldset disabled={submitting} className="advanced-content">
        <label className="field" htmlFor="stress-test-title-input"><span>Stress test title</span><input id="stress-test-title-input" value={title} maxLength={255} aria-invalid={Boolean(fieldError("stress-test-title-input"))} aria-describedby={fieldError("stress-test-title-input") ? "stress-test-title-error" : undefined} onChange={event => { changed(); setTitle(event.target.value); }}/>{fieldError("stress-test-title-input") && <small className="field-error" id="stress-test-title-error">{fieldError("stress-test-title-input")}</small>}</label>
        <div className="form-section-heading"><div><h3>Assumptions</h3><p>Add facts the analysis should treat as given.</p></div>{assumptions.length < MAX_ASSUMPTIONS && <button id="add-assumption" type="button" className="button ghost" onClick={addAssumption}><Plus aria-hidden="true" size={16}/>Add assumption</button>}</div>
        {assumptions.map((item, index) => <div className="assumption-editor" key={item.id}><label className="field" htmlFor={`assumption-${index}`}><span>Assumption {index + 1}</span><input id={`assumption-${index}`} maxLength={MAX_TEXT_LENGTH} value={item.text} aria-invalid={Boolean(fieldError(`assumption-${index}`))} onChange={event => updateAssumption(index, { text: event.target.value })}/>{fieldError(`assumption-${index}`) && <small className="field-error">{fieldError(`assumption-${index}`)}</small>}</label><label className="field" htmlFor={`assumption-scenario-${index}`}><span>Related change</span><select id={`assumption-scenario-${index}`} value={item.scenarioId} onChange={event => updateAssumption(index, { scenarioId: event.target.value })}><option value="">All changes</option>{scenarios.map(scenario => <option key={scenario.id} value={scenario.id}>{scenarioLabel(scenario)}</option>)}</select></label><button type="button" aria-label={`Remove assumption ${index + 1}`} className="icon-button assumption-remove" onClick={() => removeAssumption(index)}><Trash2 aria-hidden="true" size={17}/></button></div>)}
      </fieldset></details>
      {error && validationErrors.length > 0 && <div role="alert" className="form-error"><p>{error}</p>{validationErrors.length > 1 && <ul>{validationErrors.map((item, index) => <li key={`${item.field}-${index}`}>{item.message}</li>)}</ul>}</div>}
      <div className="stress-dialog-actions">
        {error && validationErrors.length === 0 && <div role="alert" className="form-error"><p>{error}</p></div>}
        {submitting && <p role="status" className="submission-note">Assessing how the Strategy responds to your changes.</p>}
        <footer><button type="button" className="button secondary" disabled={submitting} onClick={onClose}>Cancel</button><button type="submit" className="button simulation-primary" disabled={submitting} aria-busy={submitting}>{submitting ? "Stress-testing your strategy..." : error && !validationErrors.length ? "Retry stress test" : "Create stress test"}</button></footer>
      </div>
    </form>
  </section></div>;
}
