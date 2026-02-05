import { test, expect } from "@playwright/test";
import { registerAndOnboard } from "./helpers";

test("templates, opportunities, filters, saved views", async ({ page }) => {
  const { stamp } = await registerAndOnboard(page);

  await page.getByRole("link", { name: /templates/i }).click();
  await expect(page.getByText(/templates/i)).toBeVisible();
  await page.getByRole("button", { name: /use template/i }).first().click();

  await page.waitForURL(/\/app\/opportunities/);
  await expect(page.getByText(/your entries/i)).toBeVisible();

  const draftTitle = `Draft ${stamp}`;
  await page.getByLabel("Title").fill(draftTitle);
  await page.getByLabel("Details").fill("Draft entry");
  await page.getByRole("button", { name: /save draft/i }).click();

  const title = `Idea ${stamp}`;
  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Details").fill("Simple test entry");
  await page.getByLabel("Probability (%)").fill("60");
  await page.getByLabel("Mark as favorite").check();
  await page.getByRole("button", { name: /add/i }).click();

  await expect(page.getByRole("table")).toContainText(title);

  await page.getByPlaceholder("Search titles").fill("Idea");
  await page.getByLabel("Favorites only").check();
  await page.getByRole("button", { name: /apply/i }).click();
  await page.waitForURL(/favorite=1/);
  await expect(page.getByRole("table")).toContainText(title);

  await page.getByPlaceholder("Save view name").fill("Favs");
  await page.getByRole("button", { name: /save view/i }).click();
  await page.getByRole("link", { name: "Favs" }).click();
  await expect(page.getByRole("table")).toContainText(title);
});
