import { test, expect } from "@playwright/test";

test("user can register, login, and add an entry", async ({ page }) => {
  const stamp = Date.now();
  const email = `test+${stamp}@example.com`;
  const password = "TestPass123!";
  const name = "Test User";

  // Register
  await page.goto("/auth/register");
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /sign up/i }).click();

  // Login
  await page.waitForURL(/\/auth\/login/);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /log in/i }).click();

  // App page
  await page.waitForURL(/\/app/);
  await expect(page.getByRole("heading", { name: /your entries/i })).toBeVisible();

  // Add entry
  const title = `Idea ${stamp}`;
  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Details").fill("Simple test entry");
  await page.getByRole("button", { name: /add/i }).click();

  await expect(page.getByText(title)).toBeVisible();
});
