import { test, expect } from "@playwright/test";

test("landing page CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /turn raw ideas/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /get started/i })).toBeVisible();
});
