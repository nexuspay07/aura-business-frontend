import { expect, test } from "@playwright/test";
import {
  MAX_ASSUMPTIONS,
  MAX_SCENARIOS,
  normalizeStressTestRequest,
  stableScenarioKey,
  strategyScenarioSuggestions,
  validateStressTestForm,
} from "../src/components/simulation/stressTestForm.js";

const scenario = (id, changes = {}) => ({ id, choice: "unexpected_expense", customName: "", details: "Savings decrease by $1,000.", severity: "HIGH", ...changes });
const form = changes => ({ title: "Laptop strategy stress test", scenarios: [scenario("one")], assumptions: [], ...changes });

test("plain-language fields map to the exact canonical DTO", () => {
  expect(normalizeStressTestRequest(form(), {})).toEqual({
    title: "Laptop strategy stress test",
    scenarios: [{
      key: "unexpected_expense",
      name: "Unexpected expense",
      description: "Savings decrease by $1,000.",
      changed_conditions: ["Savings decrease by $1,000."],
      qualitative_severity: "HIGH",
    }],
    user_assumptions: [],
  });
});

test("severity labels map to backend enums without changing scenario order", () => {
  const request = normalizeStressTestRequest(form({ scenarios: [
    scenario("one", { severity: "LOW" }),
    scenario("two", { choice: "timeline_change", details: "Delivery moves later.", severity: "MODERATE" }),
    scenario("three", { choice: "cost_increase", details: "Costs rise.", severity: "HIGH" }),
  ] }), {});
  expect(request.scenarios.map(item => item.key)).toEqual(["unexpected_expense", "timeline_change", "cost_increase"]);
  expect(request.scenarios.map(item => item.qualitative_severity)).toEqual(["LOW", "MODERATE", "HIGH"]);
});

test("custom keys are valid, bounded, and deterministically unique", () => {
  const longName = `99 — Déjà ${"cost ".repeat(30)}`;
  const request = normalizeStressTestRequest(form({ scenarios: [
    scenario("one", { choice: "custom", customName: longName }),
    scenario("two", { choice: "custom", customName: longName }),
    scenario("three", { choice: "custom", customName: "!!!" }),
  ] }), {});
  const keys = request.scenarios.map(item => item.key);
  expect(keys[0]).toMatch(/^[a-z][a-z0-9_]{0,63}$/);
  expect(keys[1]).toMatch(/_2$/);
  expect(keys[2]).toBe("scenario_custom");
  expect(new Set(keys).size).toBe(3);
  expect(keys.every(key => key.length <= 64)).toBe(true);
  expect(stableScenarioKey("Éxpense change")).toBe("expense_change");
});

test("Strategy suggestions preserve source order, wording, and deterministic deduplication", () => {
  const suggestions = strategyScenarioSuggestions({
    change_conditions: ["Savings fall below the buffer.", "Costs rise."],
    uncertainties: ["Costs rise.", "Delivery timing is unclear."],
    risks: [{ risk: "Supplier availability declines." }],
  });
  expect(suggestions.map(item => item.name)).toEqual([
    "Savings fall below the buffer.", "Costs rise.", "Delivery timing is unclear.", "Supplier availability declines.",
  ]);
});

test("assumptions follow hidden generated keys and preserve order", () => {
  const request = normalizeStressTestRequest(form({
    scenarios: [scenario("first"), scenario("second", { choice: "unexpected_expense", details: "A second expense occurs." })],
    assumptions: [
      { id: "a", text: "Income remains stable.", scenarioId: "second" },
      { id: "b", text: "No additional assumption.", scenarioId: "" },
    ],
  }), {});
  expect(request.scenarios.map(item => item.key)).toEqual(["unexpected_expense", "unexpected_expense_2"]);
  expect(request.user_assumptions).toEqual([
    { text: "Income remains stable.", scenario_key: "unexpected_expense_2" },
    { text: "No additional assumption." },
  ]);
});

test("validation enforces empty details, text lengths, and collection limits", () => {
  expect(validateStressTestForm(form({ scenarios: [scenario("one", { details: "" })] }), {}).map(item => item.field)).toContain("scenario-details-0");
  expect(validateStressTestForm(form({ scenarios: [scenario("one", { details: "x".repeat(4001) })] }), {}).map(item => item.field)).toContain("scenario-details-0");
  expect(validateStressTestForm(form({ scenarios: Array.from({ length: MAX_SCENARIOS + 1 }, (_, index) => scenario(String(index))) }), {}).map(item => item.message)).toContain("Add between one and six changes.");
  expect(validateStressTestForm(form({ assumptions: Array.from({ length: MAX_ASSUMPTIONS + 1 }, (_, index) => ({ id: String(index), text: "Given.", scenarioId: "" })) }), {}).map(item => item.message)).toContain("Use no more than thirty assumptions.");
});
