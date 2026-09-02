import { expect, test } from "@playwright/test";

const personal = {
  user: { id: 2, email: "person@aura.local", full_name: "Founder", role: "user" },
  organization: { id: 2, name: "Personal Space", account_type: "personal" },
  workspace: { id: 2, name: "My Workspace" },
  product_mode: "personal",
  capabilities: ["home", "personal_home", "ask_aura", "decisions", "personal_context"],
};

test("prelaunch runtime has only Aevric AI public branding", async ({ page }) => {
  await page.goto("/");
  const landing = await page.locator("body").innerText();
  await expect(page).toHaveTitle("Aevric AI");
  await expect(page.getByText("Aevric AI", { exact: true }).first()).toBeVisible();
  expect(landing).not.toMatch(/\bAura\b/);
  expect(landing).not.toContain("Try Aura");
  expect(landing).not.toContain("Ask Aura anything");

  await page.addInitScript(() => localStorage.setItem("aura_token", "prelaunch-brand-check"));
  await page.route("**/auth/me", route => route.fulfill({ contentType: "application/json", body: JSON.stringify(personal) }));
  await page.route("**/organizations", route => route.fulfill({ contentType: "application/json", body: JSON.stringify({ organizations: [personal.organization] }) }));
  await page.route("**/personal/decisions", route => route.fulfill({ contentType: "application/json", body: "[]" }));
  await page.goto("/dashboard");
  const authenticated = await page.locator("body").innerText();
  await expect(page.getByText("Aevric AI", { exact: true }).first()).toBeVisible();
  expect(authenticated).not.toMatch(/\bAura\b/);
  expect(authenticated).not.toContain("Talk to Aura");
  expect(authenticated).not.toContain("Use Aura for decisions");
});
