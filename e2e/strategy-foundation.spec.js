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

test("authenticated shared navigation registers Strategy public routes", async ({ page }) => {
  await authenticate(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/strategies");
  await expect(page.getByRole("heading", { name: "Strategies", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByLabel("Primary navigation").getByRole("link", { name: "Strategies" })).toBeVisible();

  await page.route("**/strategy-resources/strategy-public-uuid", route => route.fulfill({ contentType: "application/json", body: JSON.stringify({ public_id: "strategy-public-uuid", title: "Strategy", current_revision: 1, resource_version: 1, archived: false, archived_at: null, created_at: "2026-09-25T12:00:00Z", updated_at: "2026-09-25T12:00:00Z", strategy: {} }) }));
  await page.goto("/strategies/strategy-public-uuid");
  await expect(page).toHaveURL(/\/strategies\/strategy-public-uuid$/);
  await expect(page.getByRole("heading", { name: "Strategy", exact: true })).toBeVisible();
});

test("Strategy APIs preserve public identifiers, request shape, and caller idempotency", async ({ page }) => {
  await page.goto("/");
  const requests = [];
  await page.route("**/strategy-resources**", async route => {
    requests.push({ url: route.request().url(), method: route.request().method() });
    await route.fulfill({ contentType: "application/json", body: JSON.stringify(route.request().url().includes("public%2Fuuid") ? { public_id: "public/uuid", strategy: {} } : { items: [] }) });
  });
  await page.route("**/personal/decisions/**/strategy", async route => {
    requests.push({
      url: route.request().url(),
      method: route.request().method(),
      body: route.request().postDataJSON(),
      key: route.request().headers()["idempotency-key"],
    });
    await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ public_id: "strategy-uuid" }) });
  });

  await page.evaluate(async () => {
    const api = await import("/src/services/api.js");
    await api.listStrategyResources(25);
    await api.getStrategyResource("public/uuid");
    await api.createStrategyFromDecision("decision/public", "Execution plan", "caller-key");
  });

  expect(new URL(requests[0].url).searchParams.get("limit")).toBe("25");
  expect(requests[1].url).toContain("/strategy-resources/public%2Fuuid");
  expect(requests[2]).toMatchObject({
    method: "POST",
    body: { title: "Execution plan" },
    key: "caller-key",
  });
  expect(requests[2].url).toContain("/personal/decisions/decision%2Fpublic/strategy");
  expect(Object.keys(requests[2].body)).toEqual(["title"]);
});

test("Decision responses retain public UUID while numeric detail routing remains", async ({ page }) => {
  await authenticate(page);
  await page.route("**/personal/decisions", route => route.fulfill({ contentType: "application/json", body: JSON.stringify([{ id: 41, public_id: "decision-public-uuid", title: "Choose a direction", status: "open" }]) }));
  await page.goto("/");
  const records = await page.evaluate(async () => {
    const { listPersonalDecisions } = await import("/src/services/api.js");
    return listPersonalDecisions();
  });
  expect(records[0]).toMatchObject({ id: 41, public_id: "decision-public-uuid" });
  await page.goto("/decisions");
  const decisionLink = page.getByRole("link", { name: /Choose a direction/ });
  await expect(decisionLink).toHaveAttribute("href", "/decisions/41");
});

test("idempotency helper creates opaque UUIDs without persistence", async ({ page }) => {
  await page.goto("/");
  const keys = await page.evaluate(async () => {
    const { createIdempotencyKey } = await import("/src/services/idempotency.js");
    return [createIdempotencyKey(), createIdempotencyKey()];
  });
  expect(keys[0]).not.toBe(keys[1]);
  expect(keys[0]).toMatch(/^[0-9a-f-]{36}$/i);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
});
