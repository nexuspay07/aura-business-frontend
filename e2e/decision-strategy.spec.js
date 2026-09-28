import { expect, test } from "@playwright/test";

const identity = {
  user: { id: 2, email: "person@aura.local", full_name: "Personal User" },
  organization: { id: 2, name: "Personal Space", account_type: "personal" },
  workspace: { id: 2, name: "My Workspace" },
  product_mode: "personal",
  capabilities: ["home", "personal_home", "ask_aura", "decisions"],
};

const decision = {
  id: 41,
  public_id: "decision-public-uuid",
  title: "Expand without weakening service",
  status: "decided",
  recommendation: "Stabilize service before expanding.",
  analysis_snapshot: {},
  user_choice: "Sequence expansion",
  user_choice_rationale: "Reliability comes first.",
  updated_at: "2026-09-25T12:00:00Z",
};

async function authenticate(page, value = decision) {
  await page.addInitScript(() => localStorage.setItem("aura_token", "test"));
  await page.route("**/auth/me", route => route.fulfill({ contentType: "application/json", body: JSON.stringify(identity) }));
  await page.route("**/organizations", route => route.fulfill({ contentType: "application/json", body: JSON.stringify({ organizations: [identity.organization] }) }));
  await page.route("**/personal/decisions/41", route => {
    if (route.request().method() === "GET") return route.fulfill({ contentType: "application/json", body: JSON.stringify(value) });
    return route.fulfill({ contentType: "application/json", body: JSON.stringify(value) });
  });
}

async function openDialog(page) {
  const trigger = page.getByRole("button", { name: "Develop Strategy", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Develop Strategy" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleDescription(/persistent Strategy from this saved Decision/);
  await expect(page.getByLabel("Strategy title")).toBeFocused();
  return dialog;
}

test("eligible Decision creates one Strategy with public identity, trimmed title, and returned navigation", async ({ page }) => {
  await authenticate(page);
  const requests = [];
  await page.route("**/personal/decisions/decision-public-uuid/strategy", async route => {
    requests.push({ body: route.request().postDataJSON(), headers: route.request().headers() });
    await new Promise(resolve => setTimeout(resolve, 150));
    await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ public_id: "created-strategy-uuid" }) });
  });
  await page.route("**/strategy-resources/created-strategy-uuid", route => route.fulfill({ contentType: "application/json", body: JSON.stringify({ public_id: "created-strategy-uuid", title: "Expansion strategy", current_revision: 1, archived: false, updated_at: "2026-09-25T12:00:00Z", strategy: {} }) }));

  await page.goto("/decisions/41");
  expect(requests).toHaveLength(0);
  const dialog = await openDialog(page);
  const title = page.getByLabel("Strategy title");
  await expect(title).toHaveValue(decision.title);
  await title.fill("  Expansion strategy  ");
  const submit = dialog.getByRole("button", { name: "Develop Strategy", exact: true });
  await submit.dblclick();
  await expect(dialog.getByRole("button", { name: "Developing Strategy…" })).toBeDisabled();
  await expect(page).toHaveURL(/\/strategies\/created-strategy-uuid$/);
  expect(requests).toHaveLength(1);
  expect(requests[0].body).toEqual({ title: "Expansion strategy" });
  expect(Object.keys(requests[0].body)).toEqual(["title"]);
  expect(requests[0].headers["idempotency-key"]).toMatch(/^[0-9a-f-]{36}$/i);
  for (const forbidden of ["id", "user_id", "organization_id", "workspace_id", "snapshot_id", "strategy"]) expect(requests[0].body).not.toHaveProperty(forbidden);
});

test("dialog validates title, closes with Escape, restores focus, and historical records remain readable", async ({ page }) => {
  await authenticate(page);
  let strategyRequests = 0;
  await page.route("**/personal/decisions/**/strategy", route => { strategyRequests += 1; return route.abort(); });
  await page.goto("/decisions/41");
  let dialog = await openDialog(page);
  const title = page.getByLabel("Strategy title");
  await title.fill("   ");
  await dialog.getByRole("button", { name: "Develop Strategy", exact: true }).click();
  await expect(dialog.getByRole("alert")).toHaveText("Enter a Strategy title.");
  expect(strategyRequests).toBe(0);
  await title.evaluate(element => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(element, "x".repeat(256));
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await dialog.getByRole("button", { name: "Develop Strategy", exact: true }).click();
  await expect(dialog.getByRole("alert")).toHaveText("Strategy title must be 255 characters or fewer.");
  await title.fill("Valid title");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Develop Strategy", exact: true })).toBeFocused();

  await page.unroute("**/personal/decisions/41");
  await page.route("**/personal/decisions/41", route => route.fulfill({ contentType: "application/json", body: JSON.stringify({ ...decision, public_id: undefined }) }));
  await page.reload();
  await expect(page.getByText("Strategy development is not available for this historical Decision.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Develop Strategy", exact: true })).toHaveCount(0);
  expect(strategyRequests).toBe(0);
});

test("in-progress retry preserves the same logical title and idempotency key", async ({ page }) => {
  await authenticate(page);
  const requests = [];
  await page.route("**/personal/decisions/decision-public-uuid/strategy", route => {
    requests.push({ body: route.request().postDataJSON(), key: route.request().headers()["idempotency-key"] });
    if (requests.length === 1) return route.fulfill({ status: 409, contentType: "application/json", body: JSON.stringify({ detail: { code: "strategy_creation_in_progress", message: "internal" } }) });
    return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ public_id: "replayed-strategy-uuid" }) });
  });
  await page.route("**/strategy-resources/replayed-strategy-uuid", route => route.fulfill({ contentType: "application/json", body: JSON.stringify({ public_id: "replayed-strategy-uuid", title: decision.title, current_revision: 1, archived: false, updated_at: "2026-09-25T12:00:00Z", strategy: {} }) }));
  await page.goto("/decisions/41");
  const dialog = await openDialog(page);
  await dialog.getByRole("button", { name: "Develop Strategy", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("already in progress");
  await dialog.getByRole("button", { name: "Retry" }).click();
  await expect(page).toHaveURL(/\/strategies\/replayed-strategy-uuid$/);
  expect(requests).toHaveLength(2);
  expect(requests[1]).toEqual(requests[0]);
});

test("changed title and abandoned dialog create new logical idempotency keys", async ({ page }) => {
  await authenticate(page);
  const requests = [];
  await page.route("**/personal/decisions/decision-public-uuid/strategy", route => {
    requests.push({ title: route.request().postDataJSON().title, key: route.request().headers()["idempotency-key"] });
    return route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ detail: "unavailable" }) });
  });
  await page.goto("/decisions/41");
  let dialog = await openDialog(page);
  await dialog.getByRole("button", { name: "Develop Strategy", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("temporarily unavailable");
  await page.getByLabel("Strategy title").fill("Changed strategy title");
  await dialog.getByRole("button", { name: "Develop Strategy", exact: true }).click();
  await expect.poll(() => requests.length).toBe(2);
  expect(requests[1].key).not.toBe(requests[0].key);
  await dialog.getByRole("button", { name: "Cancel" }).click();
  dialog = await openDialog(page);
  await dialog.getByRole("button", { name: "Develop Strategy", exact: true }).click();
  await expect.poll(() => requests.length).toBe(3);
  expect(requests[2].key).not.toBe(requests[1].key);
});

test("stable conflicts and provider failures use distinct product-safe accessible messages", async ({ page }) => {
  await authenticate(page);
  const cases = [
    [409, "decision_canonical_snapshot_unavailable", "saved before Strategy development was available"],
    [409, "decision_choice_requires_reevaluation", "Re-evaluate the decision"],
    [409, "strategy_conflict", "conflicts with its current state"],
    [422, null, "A reliable Strategy could not be produced"],
    [502, null, "could not produce a valid Strategy"],
    [503, null, "temporarily unavailable"],
    [504, null, "needs more time"],
    [404, null, "required resource is not available"],
    [500, null, "could not be completed"],
  ];
  let current = cases[0];
  await page.route("**/personal/decisions/decision-public-uuid/strategy", route => route.fulfill({ status: current[0], contentType: "application/json", body: JSON.stringify({ detail: current[1] ? { code: current[1], message: "internal detail" } : "internal detail" }) }));
  await page.goto("/decisions/41");
  for (const item of cases) {
    current = item;
    const dialog = await openDialog(page);
    await dialog.getByRole("button", { name: "Develop Strategy", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText(item[2]);
    await expect(dialog).not.toContainText("internal detail");
    if (["decision_canonical_snapshot_unavailable", "decision_choice_requires_reevaluation", "strategy_conflict"].includes(item[1]) || [404, 422].includes(item[0])) {
      await expect(dialog.getByRole("button", { name: "Develop Strategy", exact: true })).toBeDisabled();
    }
    await dialog.getByRole("button", { name: "Cancel" }).click();
  }
});

test("existing Decision update and delete operations remain numeric and independent", async ({ page }) => {
  await authenticate(page);
  await page.unroute("**/personal/decisions/41");
  const requests = [];
  await page.route("**/personal/decisions/41", route => {
    const method = route.request().method();
    requests.push({ method, url: route.request().url(), body: method === "PATCH" ? route.request().postDataJSON() : null });
    if (method === "DELETE") return route.fulfill({ status: 204 });
    return route.fulfill({ contentType: "application/json", body: JSON.stringify(method === "PATCH" ? { ...decision, ...route.request().postDataJSON() } : decision) });
  });
  await page.goto("/decisions/41");
  await page.getByLabel("What did you choose?").fill("Expand in stages");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect.poll(() => requests.some(request => request.method === "PATCH")).toBe(true);
  const patchRequest = requests.find(request => request.method === "PATCH");
  expect(new URL(patchRequest.url).pathname).toBe("/personal/decisions/41");
  expect(patchRequest.body.user_choice).toBe("Expand in stages");
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Delete decision" }).click();
  await expect(page).toHaveURL(/\/decisions$/);
  expect(requests.some(request => request.method === "DELETE" && new URL(request.url).pathname === "/personal/decisions/41")).toBe(true);
});
