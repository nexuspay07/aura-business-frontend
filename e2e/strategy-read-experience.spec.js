import { expect, test } from "@playwright/test";

const identity = {
  user: { id: 2, email: "person@aura.local", full_name: "Personal User" },
  organization: { id: 2, name: "Personal Space", account_type: "personal" },
  workspace: { id: 2, name: "My Workspace" },
  product_mode: "personal",
  capabilities: ["home", "personal_home", "ask_aura", "decisions"],
};

async function authenticate(page) {
  await page.addInitScript(() => localStorage.setItem("aura_token", "test"));
  await page.route("**/auth/me", route => route.fulfill({ contentType: "application/json", body: JSON.stringify(identity) }));
  await page.route("**/organizations", route => route.fulfill({ contentType: "application/json", body: JSON.stringify({ organizations: [identity.organization] }) }));
}

const resource = {
  public_id: "strategy-public-uuid",
  title: "Reliable expansion strategy",
  current_revision: 1,
  resource_version: 7,
  archived: true,
  archived_at: "2026-09-24T12:00:00Z",
  created_at: "2026-09-23T12:00:00Z",
  updated_at: "2026-09-25T12:00:00Z",
  internal_id: 999,
  strategy: {
    objective: "Expand while protecting service reliability.",
    chosen_direction: "Sequence expansion after stabilization.",
    approach: "Stabilize the operating foundation, then expand in measured stages.",
    phases: [{ order: 1, name: "Stabilize", purpose: "Improve reliability first.", focus_areas: ["Support response", "Release quality"], milestone_intent: "Reliability is consistently measurable." }],
    constraints: [{ statement: "Maintain service continuity." }],
    resources: [{ name: "Operations team", description: "Owns reliability improvements." }],
    risks: [{ risk: "Expansion may outpace capacity.", mitigation: "Gate each stage on reliability evidence." }],
    success_measures: [{ condition: "Service reliability remains stable.", evidence_ref: "evidence-1" }],
    assumptions: [{ statement: "The team can sequence the work.", source: "decision" }],
    uncertainties: ["Demand timing may change."],
    change_conditions: ["Reliability falls below the accepted threshold."],
    confidence: "moderate",
    confidence_rationale: ["Operational evidence is incomplete."],
    time_horizon: "12 months",
    evidence_references: [{ evidence_id: "evidence-1", citation_label: "Reliability review" }],
    source_decision_id: 123,
    source_reference: "personal-decision:decision-public-uuid",
  },
};

test("Strategies list shows loading, metadata, archived state, and one public-ID link without N+1 requests", async ({ page }) => {
  await authenticate(page);
  let listRequests = 0;
  let detailRequests = 0;
  await page.route("**/strategy-resources**", async route => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/strategy-resources") {
      listRequests += 1;
      await new Promise(resolve => setTimeout(resolve, 120));
      await route.fulfill({ contentType: "application/json", body: JSON.stringify({ items: [resource] }) });
      return;
    }
    detailRequests += 1;
    await route.fulfill({ status: 500, body: "{}" });
  });

  await page.goto("/strategies");
  await expect(page.getByRole("status")).toHaveText("Loading Strategies…");
  const link = page.getByRole("link", { name: /Reliable expansion strategy/ });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "/strategies/strategy-public-uuid");
  await expect(link).toContainText("Revision 1");
  await expect(link).toContainText("Archived");
  await expect(link).toContainText(/Updated Sep 25, 2026/);
  await expect(page.getByText("Expand while protecting service reliability.")).toHaveCount(0);
  expect(listRequests).toBe(1);
  expect(detailRequests).toBe(0);
});

test("Strategies list renders an empty state with a Decisions action", async ({ page }) => {
  await authenticate(page);
  await page.route("**/strategy-resources", route => route.fulfill({ contentType: "application/json", body: JSON.stringify({ items: [] }) }));
  await page.goto("/strategies");
  await expect(page.getByRole("heading", { name: "No Strategies yet" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Go to Decisions" })).toHaveAttribute("href", "/decisions");
});

test("Strategies list renders a product-safe accessible error", async ({ page }) => {
  await authenticate(page);
  await page.route("**/strategy-resources", route => route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ detail: "database traceback" }) }));
  await page.goto("/strategies");
  await expect(page.getByRole("alert")).toContainText("Strategies could not be loaded");
  await expect(page.locator("body")).not.toContainText("database traceback");
});

test("Strategy detail renders the complete structured read model from its public route parameter", async ({ page }) => {
  await authenticate(page);
  await page.setViewportSize({ width: 390, height: 844 });
  const requestedPaths = [];
  await page.route("**/strategy-resources/**", async route => {
    requestedPaths.push(new URL(route.request().url()).pathname);
    await new Promise(resolve => setTimeout(resolve, 120));
    await route.fulfill({ contentType: "application/json", body: JSON.stringify(resource) });
  });

  await page.goto("/strategies/strategy-public-uuid");
  await expect(page.getByRole("status")).toHaveText("Loading Strategy…");
  await expect(page.getByRole("heading", { level: 1, name: resource.title })).toBeVisible();
  await expect(page.getByText("Revision 1", { exact: true })).toBeVisible();
  await expect(page.getByText(/Updated Sep 25, 2026/)).toBeVisible();
  await expect(page.getByText("Archived", { exact: true })).toBeVisible();
  await expect(page.getByText(resource.strategy.objective)).toBeVisible();
  await expect(page.getByText(resource.strategy.chosen_direction)).toBeVisible();
  await expect(page.getByText(resource.strategy.approach)).toBeVisible();
  await expect(page.getByRole("list").filter({ hasText: "Stabilize" })).toBeVisible();
  for (const text of ["Improve reliability first.", "Support response", "Reliability is consistently measurable.", "Operations team", "Maintain service continuity.", "Expansion may outpace capacity.", "Gate each stage on reliability evidence.", "Service reliability remains stable.", "The team can sequence the work.", "Source: decision", "Demand timing may change.", "Reliability falls below the accepted threshold.", "moderate", "Operational evidence is incomplete.", "12 months", "Reliability review", "evidence-1"]) {
    await expect(page.getByText(text, { exact: false }).first()).toBeVisible();
  }
  expect(requestedPaths).toEqual(["/strategy-resources/strategy-public-uuid"]);
  const body = await page.locator("body").innerText();
  for (const forbidden of ["999", "123", "resource_version", "source_decision_id", "personal-decision:decision-public-uuid", "canonical_result_json"]) expect(body).not.toContain(forbidden);
  expect(body).not.toContain(JSON.stringify(resource.strategy));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("Strategy detail omits empty optional sections without breaking the page", async ({ page }) => {
  await authenticate(page);
  const sparse = { ...resource, archived: false, title: "Focused strategy", strategy: { objective: "Protect the core service.", chosen_direction: "Stabilize first.", approach: "Address the highest-impact reliability gap.", phases: [], constraints: [], resources: [], risks: [], success_measures: [], assumptions: [], uncertainties: [], change_conditions: [], confidence: "low", confidence_rationale: [], time_horizon: null, evidence_references: [] } };
  await page.route("**/strategy-resources/**", route => route.fulfill({ contentType: "application/json", body: JSON.stringify(sparse) }));
  await page.goto("/strategies/sparse-public-uuid");
  await expect(page.getByRole("heading", { level: 1, name: "Focused strategy" })).toBeVisible();
  for (const heading of ["Phases", "Resources", "Constraints", "Risks & Mitigations", "Success Measures", "Assumptions", "Uncertainties", "Change Conditions", "Confidence Rationale", "Evidence References"]) await expect(page.getByRole("heading", { name: heading, exact: true })).toHaveCount(0);
});

test("Strategy detail presents tenant-safe 404 and product-safe general errors", async ({ page }) => {
  await authenticate(page);
  await page.route("**/strategy-resources/missing", route => route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ detail: "Strategy not found" }) }));
  await page.goto("/strategies/missing");
  await expect(page.getByRole("alert").getByRole("heading", { name: "Strategy not found" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to Strategies" })).toHaveAttribute("href", "/strategies");

  await page.route("**/strategy-resources/broken", route => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ detail: "provider internals" }) }));
  await page.goto("/strategies/broken");
  await expect(page.getByRole("alert")).toContainText("Strategy could not be loaded");
  await expect(page.locator("body")).not.toContainText("provider internals");
});
