import { test, expect } from "@playwright/test";

test("full product flow", async ({ page }) => {
  const stamp = Date.now();
  const email = `test+${stamp}@example.com`;
  const password = "TestPass123!";
  const name = "Test User";

  // Landing page CTA
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /turn raw ideas/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /get started/i })).toBeVisible();

  // Register
  await page.getByRole("link", { name: /get started/i }).click();
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /sign up/i }).click();

  // Login
  await page.waitForURL(/\/auth\/login/);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /log in/i }).click();

  // Onboarding
  await page.waitForURL(/\/app\/onboarding/);
  await page.getByRole("button", { name: "Next" }).nth(0).click();
  await page.getByRole("button", { name: "Next" }).nth(0).click();
  await page.getByRole("button", { name: /finish setup/i }).click();

  // Dashboard widgets
  await page.waitForURL(/\/app/);
  await expect(page.getByText(/welcome back/i)).toBeVisible();
  await expect(page.getByText(/recent activity/i)).toBeVisible();
  await expect(page.getByText("Drafts", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/quick stats/i)).toBeVisible();

  // Theme toggle
  const initialTheme = await page.evaluate(() =>
    document.documentElement.classList.contains("dark")
  );
  await page.getByRole("button", { name: /light|dark/i }).click();
  const toggledTheme = await page.evaluate(() =>
    document.documentElement.classList.contains("dark")
  );
  expect(toggledTheme).toBe(!initialTheme);

  // Templates
  await page.getByRole("link", { name: /templates/i }).click();
  await expect(page.getByText(/templates/i)).toBeVisible();
  await page.getByRole("button", { name: /use template/i }).first().click();

  // Opportunities
  await page.waitForURL(/\/app\/opportunities/);
  await expect(page.getByText(/your entries/i)).toBeVisible();

  // Add draft
  const draftTitle = `Draft ${stamp}`;
  await page.getByLabel("Title").fill(draftTitle);
  await page.getByLabel("Details").fill("Draft entry");
  await page.getByRole("button", { name: /save draft/i }).click();

  // Add entry
  const title = `Idea ${stamp}`;
  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Details").fill("Simple test entry");
  await page.getByLabel("Probability (%)").fill("60");
  await page.getByLabel("Mark as favorite").check();
  await page.getByRole("button", { name: /add/i }).click();

  await expect(page.getByRole("table")).toContainText(title);

  // Filters
  await page.getByPlaceholder("Search titles").fill("Idea");
  await page.getByLabel("Favorites only").check();
  await page.getByRole("button", { name: /apply/i }).click();
  await page.waitForURL(/favorite=1/);
  await expect(page.getByRole("table")).toContainText(title);

  // Saved view
  await page.getByPlaceholder("Save view name").fill("Favs");
  await page.getByRole("button", { name: /save view/i }).click();
  await page.getByRole("link", { name: "Favs" }).click();
  await expect(page.getByText(title)).toBeVisible();

  // Insights
  await page.getByRole("link", { name: /insights/i }).click();
  await expect(page.getByText(/insights/i)).toBeVisible();

  // Export checks
  const csvStatus = await page.evaluate(async () => {
    const res = await fetch("/api/export/csv");
    return res.status;
  });
  expect(csvStatus).toBe(200);

  const pdfStatus = await page.evaluate(async () => {
    const res = await fetch("/api/export/pdf");
    return res.status;
  });
  expect(pdfStatus).toBe(200);
});
