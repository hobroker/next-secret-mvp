import { test, expect } from "@playwright/test";
import { registerAndOnboard } from "./helpers";

test("theme toggle and insights", async ({ page }) => {
  await registerAndOnboard(page);

  const initialTheme = await page.evaluate(() =>
    document.documentElement.classList.contains("dark")
  );
  await page.getByRole("button", { name: /light|dark/i }).click();
  const toggledTheme = await page.evaluate(() =>
    document.documentElement.classList.contains("dark")
  );
  expect(toggledTheme).toBe(!initialTheme);

  await page.getByRole("link", { name: /insights/i }).click();
  await expect(page.getByText(/insights/i)).toBeVisible();
});
