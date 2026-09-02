import { expect, test } from "@playwright/test";

test.describe("private Alpha legal readiness", () => {
  for (const [path, heading] of [["/privacy", "Privacy Policy"], ["/terms", "Terms of Use"], ["/alpha", "Private Alpha"]]) {
    test(`${path} is public and readable`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      await expect(page.getByText("Effective September 2026")).toBeVisible();
      await expect(page.getByRole("link", { name: "Aevric", exact: true }).first()).toBeVisible();
    });
  }

  test("homepage footer links to every legal page", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.locator("span").first()).toContainText("2026 Aevric");
    await expect(footer.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    await expect(footer.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
    await expect(footer.getByRole("link", { name: "Private Alpha" })).toHaveAttribute("href", "/alpha");
  });

  test("signup requires acknowledgement and exposes legal links", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("checkbox")).toHaveAttribute("required", "");
    await expect(page.getByRole("link", { name: "Terms of Use" })).toHaveAttribute("href", "/terms");
    await expect(page.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy");
  });
});
