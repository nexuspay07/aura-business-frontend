export const MAX_SCENARIOS = 6;
export const MAX_ASSUMPTIONS = 30;
export const MAX_TEXT_LENGTH = 4000;

export const SCENARIO_PRESETS = Object.freeze([
  { id: "unexpected_expense", key: "unexpected_expense", name: "Unexpected expense" },
  { id: "income_decrease", key: "income_decrease", name: "Income decreases" },
  { id: "cost_increase", key: "cost_increase", name: "Costs increase" },
  { id: "timeline_change", key: "timeline_change", name: "Timeline changes" },
  { id: "resource_availability", key: "resource_availability", name: "Resource availability changes" },
  { id: "demand_change", key: "demand_change", name: "Demand changes" },
]);

export const SEVERITY_OPTIONS = Object.freeze([
  { label: "Minor", value: "LOW" },
  { label: "Moderate", value: "MODERATE" },
  { label: "Major", value: "HIGH" },
]);

const meaningful = value => typeof value === "string" && value.trim();

export function strategyScenarioSuggestions(strategy = {}) {
  const candidates = [
    ...(Array.isArray(strategy.change_conditions) ? strategy.change_conditions : []),
    ...(Array.isArray(strategy.uncertainties) ? strategy.uncertainties : []),
    ...(Array.isArray(strategy.risks) ? strategy.risks.map(item => item?.risk) : []),
  ];
  const seen = new Set();
  return candidates.reduce((items, value) => {
    if (!meaningful(value)) return items;
    const text = value.trim();
    const identity = text.toLowerCase();
    if (seen.has(identity)) return items;
    seen.add(identity);
    items.push({ id: `strategy_${items.length}`, name: text, details: text });
    return items;
  }, []);
}

export function stableScenarioKey(value) {
  const normalized = String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const base = normalized && /^[a-z]/.test(normalized) ? normalized : `scenario_${normalized || "custom"}`;
  return base.slice(0, 64).replace(/_+$/g, "") || "scenario_custom";
}

function uniqueKey(base, used) {
  if (!used.has(base)) { used.add(base); return base; }
  let number = 2;
  while (true) {
    const suffix = `_${number}`;
    const candidate = `${base.slice(0, 64 - suffix.length).replace(/_+$/g, "")}${suffix}`;
    if (!used.has(candidate)) { used.add(candidate); return candidate; }
    number += 1;
  }
}

function scenarioIdentity(item, strategySuggestions) {
  const preset = SCENARIO_PRESETS.find(option => option.id === item.choice);
  if (preset) return preset;
  if (item.choice?.startsWith("strategy:")) {
    const suggestion = strategySuggestions[Number(item.choice.split(":")[1])];
    if (suggestion) return { key: stableScenarioKey(suggestion.name), name: suggestion.name };
  }
  if (item.choice === "custom") {
    const name = String(item.customName || "").trim();
    return { key: stableScenarioKey(name), name };
  }
  return { key: "", name: "" };
}

export function validateStressTestForm(form, strategy = {}) {
  const errors = [];
  const scenarios = Array.isArray(form.scenarios) ? form.scenarios : [];
  if (!meaningful(form.title) || form.title.trim().length > 255) errors.push({ field: "stress-test-title-input", message: "Enter a title of 255 characters or fewer." });
  if (!scenarios.length || scenarios.length > MAX_SCENARIOS) errors.push({ field: "scenario-choice-0", message: "Add between one and six changes." });
  const suggestions = strategyScenarioSuggestions(strategy);
  scenarios.forEach((item, index) => {
    const identity = scenarioIdentity(item, suggestions);
    if (!identity.name) errors.push({ field: `scenario-choice-${index}`, message: `Choose what might change for change ${index + 1}.` });
    if (item.choice === "custom" && (!meaningful(item.customName) || item.customName.trim().length > MAX_TEXT_LENGTH)) errors.push({ field: `scenario-name-${index}`, message: `Name change ${index + 1} using 4,000 characters or fewer.` });
    if (!meaningful(item.details) || item.details.trim().length > MAX_TEXT_LENGTH) errors.push({ field: `scenario-details-${index}`, message: `Describe change ${index + 1} using 4,000 characters or fewer.` });
    if (!SEVERITY_OPTIONS.some(option => option.value === item.severity)) errors.push({ field: `scenario-severity-${index}-LOW`, message: `Choose how significant change ${index + 1} would be.` });
  });
  const assumptions = Array.isArray(form.assumptions) ? form.assumptions : [];
  if (assumptions.length > MAX_ASSUMPTIONS) errors.push({ field: "add-assumption", message: "Use no more than thirty assumptions." });
  assumptions.forEach((item, index) => {
    if (!meaningful(item.text) || item.text.trim().length > MAX_TEXT_LENGTH) errors.push({ field: `assumption-${index}`, message: `Complete assumption ${index + 1} using 4,000 characters or fewer.` });
    if (item.scenarioId && !scenarios.some(scenario => scenario.id === item.scenarioId)) errors.push({ field: `assumption-scenario-${index}`, message: `Choose an available change for assumption ${index + 1}.` });
  });
  return errors;
}

export function normalizeStressTestRequest(form, strategy = {}) {
  const errors = validateStressTestForm(form, strategy);
  if (errors.length) {
    const error = new Error("Stress Test form is invalid");
    error.validationErrors = errors;
    throw error;
  }
  const suggestions = strategyScenarioSuggestions(strategy);
  const used = new Set();
  const keyById = new Map();
  const scenarios = form.scenarios.map(item => {
    const identity = scenarioIdentity(item, suggestions);
    const key = uniqueKey(identity.key, used);
    keyById.set(item.id, key);
    const details = item.details.trim();
    return {
      key,
      name: identity.name,
      description: details,
      changed_conditions: [details],
      qualitative_severity: item.severity,
    };
  });
  return {
    title: form.title.trim(),
    scenarios,
    user_assumptions: form.assumptions.map(item => ({
      text: item.text.trim(),
      ...(item.scenarioId ? { scenario_key: keyById.get(item.scenarioId) } : {}),
    })),
  };
}

export function stressTestRequestSignature(request) {
  return JSON.stringify(request);
}
