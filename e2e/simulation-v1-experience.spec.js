import { expect, test } from "@playwright/test";

const identity = { user: { id: 2, email: "person@example.test", full_name: "Morgan Lee" }, organization: { id: 2, name: "Personal Space", account_type: "personal" }, workspace: { id: 2, name: "My Workspace" }, product_mode: "personal", capabilities: ["home", "personal_home", "ask_aura", "decisions"] };
const strategy = { public_id: "10000000-0000-4000-8000-000000000001", title: "Reliable expansion", current_revision: 3, archived: false, created_at: "2026-10-01T12:00:00Z", updated_at: "2026-10-02T12:00:00Z", strategy: { objective: "Expand without reducing reliability.", chosen_direction: "Stabilize then expand.", approach: "Sequence work.", phases: [], constraints: [], resources: [], risks: [], success_measures: [], assumptions: [], uncertainties: [], change_conditions: ["Reliability declines."], confidence: "MODERATE", confidence_rationale: [], evidence_references: [] } };
const simulation = { simulation_public_id: "20000000-0000-4000-8000-000000000001", simulation_type: "strategy_stress_test", title: "Reliable expansion stress test", source_strategy_public_id: strategy.public_id, source_strategy_revision: 3, source_decision_snapshot_public_id: "30000000-0000-4000-8000-000000000001", run_number: 1, created_at: "2026-10-03T12:00:00Z", archived: false, result: { scenario_results: [{ scenario_key: "supplier_costs", sensitivity: "HIGH", elements_under_stress: [{ statement: "Operating margin absorbs sustained pressure.", provenance: "MODEL_GENERATED", evidence_refs: [] }], plausible_effects: [{ statement: "Expansion pacing may slow.", provenance: "MODEL_GENERATED", evidence_refs: [] }], constraint_conflicts: [], risk_observations: [], mitigation_observations: [{ statement: "Sequence commitments.", provenance: "DERIVED", evidence_refs: [] }], phase_sensitivities: [], upside_conditions: [], downside_conditions: [], change_condition_triggers: [] }], cross_scenario_comparison: [{ statement: "Reliability remains the gating condition.", provenance: "DERIVED", evidence_refs: [] }], assumptions_used: [{ statement: "Staffing remains fixed.", provenance: "USER_SUPPLIED", evidence_refs: [] }], uncertainties: [{ statement: "Supplier duration remains unknown.", provenance: "MODEL_GENERATED", evidence_refs: [] }], limitations: [{ code: "not_calibrated", statement: "Scenario analysis is not calibrated forecasting.", provenance: "SYSTEM" }], confidence: "MODERATE", confidence_rationale: ["Conditions are explicit but incomplete."], evidence_refs: [], simulation_type: "strategy_stress_test", schema_version: 1 } };

async function authenticate(page) {
  await page.addInitScript(() => localStorage.setItem("aura_token", "test"));
  await page.route("**/auth/me", route => route.fulfill({ contentType: "application/json", body: JSON.stringify(identity) }));
  await page.route("**/organizations", route => route.fulfill({ contentType: "application/json", body: JSON.stringify({ organizations: [identity.organization] }) }));
}

test("light intelligence shell exposes first-class capabilities and mobile navigation", async ({ page }) => {
  await authenticate(page); await page.route("**/personal/decisions", route => route.fulfill({ json: [] }));
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Your intelligence workspace" })).toBeVisible();
  await page.getByRole("button", { name: "Open navigation" }).click();
  for (const name of ["Overview", "Ask", "Decisions", "Strategies", "Simulations"]) await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
  await expect(page.locator(".aevric-shell")).toHaveCSS("color", "rgb(20, 33, 58)");
  await expect(page.locator("body")).not.toContainText("Aura");
});

test("Simulation list handles loading, data, empty, and detail navigation", async ({ page }) => {
  await authenticate(page); await page.route("**/simulation-resources", async route => { await new Promise(resolve => setTimeout(resolve, 100)); await route.fulfill({ json: { items: [{ ...simulation, current_run_number: 1, updated_at: simulation.created_at }] } }); });
  await page.goto("/simulations"); await expect(page.getByRole("status")).toContainText("Loading saved stress tests");
  await expect(page.getByRole("heading", { name: simulation.title })).toBeVisible(); await expect(page.getByText("Revision 3")).toBeVisible();
  await expect(page.getByRole("link", { name: /Reliable expansion stress test/ })).toHaveAttribute("href", `/simulations/${simulation.simulation_public_id}`);
});

test("Simulation list empty and safe error states", async ({ page }) => {
  await authenticate(page); let error = false; await page.route("**/simulation-resources", route => error ? route.fulfill({ status: 503, json: { detail: "private database" } }) : route.fulfill({ json: { items: [] } }));
  await page.goto("/simulations"); await expect(page.getByRole("heading", { name: "No stress tests yet" })).toBeVisible();
  error = true; await page.reload(); await expect(page.getByRole("alert")).toContainText("Simulations could not be loaded"); await expect(page.locator("body")).not.toContainText("private database");
});

test("Simulation detail is structured, qualitative, trustworthy, and responsive", async ({ page }) => {
  await authenticate(page); await page.route("**/simulation-resources/**", route => route.fulfill({ json: { ...simulation, archived: true } }));
  for (const viewport of [{ width: 1440, height: 900 }, { width: 768, height: 900 }, { width: 360, height: 780 }]) {
    await page.setViewportSize(viewport); await page.goto(`/simulations/${simulation.simulation_public_id}`);
    await expect(page.getByRole("heading", { name: simulation.title })).toBeVisible(); await expect(page.getByText("Supplier Costs")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Cross-scenario comparison" })).toBeVisible(); await expect(page.getByRole("heading", { name: "Assumptions" })).toBeVisible(); await expect(page.getByRole("heading", { name: "Uncertainties" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Limitations" })).toBeVisible(); await expect(page.getByText("Scenario analysis is not calibrated forecasting.")).toBeVisible();
    await expect(page.getByText(simulation.source_decision_snapshot_public_id)).toBeVisible(); await expect(page.getByText(/exact revision 3/)).toBeVisible();
    await expect(page.getByText("Archived", { exact: true })).toBeVisible();
    await expect(page.getByText("User supplied")).toBeVisible(); await expect(page.getByText(/not a calibrated forecast or probability prediction/)).toBeVisible();
    const body = await page.locator("body").innerText(); expect(body).not.toContain("65%"); expect(body).not.toContain("canonical_result_json"); expect(body).not.toContain(JSON.stringify(simulation.result));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
});

test("Strategy Stress Test form sends canonical fields and preserves idempotency key on retry", async ({ page }) => {
  await authenticate(page); await page.route(`**/strategy-resources/${strategy.public_id}`, route => route.fulfill({ json: strategy }));
  const requests = []; await page.route(`**/strategy-resources/${strategy.public_id}/simulations`, async route => { requests.push({ headers: route.request().headers(), body: route.request().postDataJSON() }); if (requests.length < 4) await route.fulfill({ status: 503, json: { detail: "private provider" } }); else await route.fulfill({ status: 201, json: simulation }); });
  await page.route(`**/simulation-resources/${simulation.simulation_public_id}`, route => route.fulfill({ json: simulation }));
  await page.goto(`/strategies/${strategy.public_id}`); await page.getByRole("button", { name: "Stress Test Strategy" }).click();
  await expect(page.getByRole("dialog")).toBeVisible(); await page.getByLabel("What might change?").selectOption("unexpected_expense"); await page.getByLabel("Describe what would happen").fill("I have to pay an additional $1,000 from my savings after buying the laptop."); await page.getByText("Major", { exact: true }).click(); await expect(page.getByLabel("Major")).toBeChecked();
  await page.getByText("Advanced options").click(); await page.getByRole("button", { name: "Add assumption" }).click(); await page.getByLabel("Assumption 1", { exact: true }).fill("Income remains stable."); await page.getByLabel("Related change").selectOption({ label: "Unexpected expense" });
  await page.getByRole("button", { name: "Create stress test" }).click(); await expect(page.getByRole("alert")).toContainText("temporarily unavailable"); await page.getByRole("button", { name: "Retry stress test" }).click(); await expect(page.getByRole("alert")).toContainText("temporarily unavailable");
  const originalDetails = "I have to pay an additional $1,000 from my savings after buying the laptop."; await page.getByLabel("Describe what would happen").fill(`${originalDetails} Temporary edit.`); await page.getByLabel("Describe what would happen").fill(originalDetails); await page.getByRole("button", { name: "Create stress test" }).click(); await expect(page.getByRole("alert")).toContainText("temporarily unavailable");
  await page.getByLabel("Describe what would happen").fill(`${originalDetails} The purchase cannot be delayed.`); await page.getByRole("button", { name: "Create stress test" }).click();
  await expect(page).toHaveURL(`/simulations/${simulation.simulation_public_id}`); expect(requests).toHaveLength(4); expect(requests[0].headers["idempotency-key"]).toBe(requests[1].headers["idempotency-key"]); expect(requests[0].headers["idempotency-key"]).toBe(requests[2].headers["idempotency-key"]); expect(requests[0].headers["idempotency-key"]).not.toBe(requests[3].headers["idempotency-key"]); expect(requests[0].body).toEqual(requests[2].body); expect(requests[0].body.scenarios[0]).toEqual({ key: "unexpected_expense", name: "Unexpected expense", description: originalDetails, changed_conditions: [originalDetails], qualitative_severity: "HIGH" }); expect(requests[0].body.user_assumptions).toEqual([{ text: "Income remains stable.", scenario_key: "unexpected_expense" }]);
  expect(Object.keys(requests[0].body).sort()).toEqual(["scenarios", "title", "user_assumptions"]); expect(Object.keys(requests[0].body.scenarios[0]).sort()).toEqual(["changed_conditions", "description", "key", "name", "qualitative_severity"]);
  const sent = JSON.stringify(requests[0].body); for (const forbidden of ["provenance", "owner_user_id", "organization_id", "workspace_id", "strategy_revision", "provider", "model"]) expect(sent).not.toContain(forbidden);
});

test("Strategy suggestions use source wording and a double submit sends one request", async ({ page }) => {
  await authenticate(page); await page.route(`**/strategy-resources/${strategy.public_id}`, route => route.fulfill({ json: strategy })); let requests = 0;
  await page.route(`**/strategy-resources/${strategy.public_id}/simulations`, async route => { requests += 1; await new Promise(resolve => setTimeout(resolve, 100)); await route.fulfill({ status: 201, json: simulation }); });
  await page.route(`**/simulation-resources/${simulation.simulation_public_id}`, route => route.fulfill({ json: simulation })); await page.goto(`/strategies/${strategy.public_id}`); await page.getByRole("button", { name: "Stress Test Strategy" }).click();
  const choice = page.getByLabel("What might change?"); await expect(choice.locator('optgroup[label="From this Strategy"] option')).toHaveText(["Reliability declines."]); await choice.selectOption({ label: "Reliability declines." }); await expect(page.getByLabel("Describe what would happen")).toHaveValue("Reliability declines."); await page.getByText("Moderate", { exact: true }).click(); await page.getByRole("button", { name: "Create stress test" }).click({ clickCount: 2 });
  await expect(page).toHaveURL(`/simulations/${simulation.simulation_public_id}`); expect(requests).toBe(1);
});

test("Stress Test dialog traps focus, closes with Escape, and restores the trigger", async ({ page }) => {
  await authenticate(page); await page.route(`**/strategy-resources/${strategy.public_id}`, route => route.fulfill({ json: strategy }));
  await page.goto(`/strategies/${strategy.public_id}`); const trigger = page.getByRole("button", { name: "Stress Test Strategy" }); await trigger.focus(); await trigger.click();
  const dialog = page.getByRole("dialog"); await expect(dialog).toBeVisible(); await expect(page.getByLabel("What might change?")).toBeFocused();
  const submit = page.getByRole("button", { name: "Create stress test" }); const close = page.getByRole("button", { name: "Close stress test" }); await submit.focus(); await page.keyboard.press("Tab"); await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab"); await expect(submit).toBeFocused();
  await page.keyboard.press("Escape"); await expect(dialog).toBeHidden(); await expect(trigger).toBeFocused();
});

test("Stress Test form validates accessibly and enforces the six-change boundary on mobile", async ({ page }) => {
  await authenticate(page); await page.route(`**/strategy-resources/${strategy.public_id}`, route => route.fulfill({ json: strategy }));
  await page.setViewportSize({ width: 360, height: 780 }); await page.goto(`/strategies/${strategy.public_id}`); await page.getByRole("button", { name: "Stress Test Strategy" }).click();
  await page.getByRole("button", { name: "Create stress test" }).click(); await expect(page.getByRole("alert")).toContainText("highlighted fields"); await expect(page.getByLabel("What might change?")).toBeFocused(); await expect(page.getByLabel("What might change?")).toHaveAttribute("aria-invalid", "true");
  const add = page.getByRole("button", { name: "Add another change" }); for (let count = 1; count < 6; count += 1) await add.click(); await expect(add).toHaveCount(0); await page.getByRole("button", { name: "Remove change 6" }).click(); await expect(page.getByRole("button", { name: "Add another change" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
