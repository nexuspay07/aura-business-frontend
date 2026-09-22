import { expect, test } from "@playwright/test";

const identity = { user: { id: 9, email: "founder@example.test", role: "platform_admin" }, organization: null, workspace: null, product_mode: "personal", capabilities: [] };
const completeness = { user_data: "historical", saved_decision_data: "historical", request_telemetry: "partial_before_canonical_instrumentation", canonical_telemetry_since: "2026-09-21T00:00:00Z" };
const windowFields = { window_start: "2026-09-14T12:00:00Z", window_end: "2026-09-21T12:00:00Z", generated_at: "2026-09-21T12:00:00Z", data_completeness: completeness };

async function authenticate(page) {
  await page.addInitScript(() => localStorage.setItem("aura_token", "opaque-session-token"));
  await page.route("**/auth/me", route => route.fulfill({ contentType: "application/json", body: JSON.stringify(identity) }));
  await page.route("**/organizations", route => route.fulfill({ contentType: "application/json", body: JSON.stringify({ organizations: [] }) }));
}

const overview = {
  ...windowFields,
  users: { total_users: 42, new_users_in_window: 5, active_users_in_window: 12, returning_users_in_window: 7 },
  intelligence: { total_requests: 80, successful_requests: 60, partial_requests: 8, failed_requests: 2, clarification_requests: 7, safety_requests: 3, operational_reliability_rate: .8571 },
  decisions: { total_saved_decisions: 21, new_saved_decisions_in_window: 4 },
  performance: { average_latency_ms: 850, p50_latency_ms: 600, p95_latency_ms: 1800 },
  usage: { known_input_tokens: 1000, known_output_tokens: 2000, known_reasoning_tokens: 500, known_total_tokens: 3500, requests_with_token_data: 50, requests_without_token_data: 30 },
  system: { status: "available", telemetry_freshness_at: "2026-09-21T11:59:00Z" },
};

test("overview uses protected API data, loading state, completeness, and window query", async ({ page }) => {
  await authenticate(page);
  const requested = [];
  await page.route("**/admin/control-center/overview**", async route => {
    requested.push(new URL(route.request().url()).searchParams.get("window"));
    await new Promise(resolve => setTimeout(resolve, 120));
    await route.fulfill({ contentType: "application/json", body: JSON.stringify(overview) });
  });
  await page.goto("/admin");
  await expect(page.getByText("Loading operational overview…")).toBeVisible();
  await expect(page.getByText("42", { exact: true })).toBeVisible();
  await expect(page.getByText("Request analytics are available from September 21, 2026.", { exact: false })).toBeVisible();
  expect(await page.locator("body").innerText()).not.toContain("PRIVATE_PROMPT");
  await page.getByRole("button", { name: "24 hours" }).click();
  await expect.poll(() => requested.at(-1)).toBe("24h");
  expect(requested).toContain("7d");
});

test("forbidden Control Center response renders access denied without details", async ({ page }) => {
  await authenticate(page);
  await page.route("**/admin/control-center/overview**", route => route.fulfill({ status: 403, contentType: "application/json", body: JSON.stringify({ detail: "internal authorization explanation" }) }));
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Access denied" })).toBeVisible();
  expect(await page.locator("body").innerText()).not.toContain("internal authorization explanation");
});

test("users table renders only safe DTO fields and forwards opaque cursor", async ({ page }) => {
  await authenticate(page);
  const cursors = [];
  await page.route("**/admin/control-center/users**", route => {
    const cursor = new URL(route.request().url()).searchParams.get("cursor"); cursors.push(cursor);
    const items = cursor ? [] : [{ user_id: 4, email: "member@example.test", full_name: "Member Name", created_at: "2026-09-20T10:00:00Z", is_active: true, is_verified: false, organization_count: 1, workspace_count: 2, last_intelligence_activity: "2026-09-21T09:00:00Z", request_count_in_window: 6, saved_decision_count: 2 }];
    route.fulfill({ contentType: "application/json", body: JSON.stringify({ ...windowFields, items, next_cursor: cursor ? null : "opaque.next/cursor+value", page_size: 25 }) });
  });
  await page.goto("/admin/users");
  await expect(page.getByText("member@example.test")).toBeVisible();
  const body = await page.locator("body").innerText();
  for (const forbidden of ["password_hash", "original_question", "recommendation", "analysis_snapshot", "PRIVATE_PROMPT"]) expect(body).not.toContain(forbidden);
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.getByRole("heading", { name: "No users found" })).toBeVisible();
  expect(cursors.at(-1)).toBe("opaque.next/cursor+value");
  expect(cursors).toContain(null);
});

test("intelligence renders honest unknown coverage and empty activity state", async ({ page }) => {
  await authenticate(page);
  await page.route("**/admin/control-center/intelligence**", route => route.fulfill({ contentType: "application/json", body: JSON.stringify({
    ...windowFields, total_requests: 3, outcomes: [{ key: "clarification", count: 1 }, { key: "failure", count: 1 }], routes: [], modes: [], providers: [{ key: "mock", count: 1 }], models: [], error_categories: [{ key: "timeout", count: 1 }],
    provider_coverage: { known_provider_requests: 1, unknown_provider_requests: 2, known_model_requests: 0, unknown_model_requests: 3 },
    tokens: { known_input_tokens: 10, known_output_tokens: 12, known_reasoning_tokens: 0, known_total_tokens: 22, requests_with_token_data: 1, requests_without_token_data: 2 },
    performance: { average_latency_ms: 120, p50_latency_ms: 100, p95_latency_ms: 200 }, execution: { total_retries: 1, requests_with_retries: 1, known_provider_calls: 2, requests_with_provider_call_data: 1 }, bucket: "day", time_series: [],
  }) }));
  await page.goto("/admin/intelligence");
  await expect(page.getByText("No intelligence requests in this period.")).toBeVisible();
  await expect(page.getByText("1 known · 2 unknown")).toBeVisible();
  await expect(page.getByText("0 known · 3 unknown")).toBeVisible();
  await expect(page.getByText("1 with data · 2 without")).toBeVisible();
});
