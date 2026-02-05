import { Page, expect } from "@playwright/test";

export async function registerAndOnboard(page: Page) {
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const email = `test+${stamp}@example.com`;
  const password = "TestPass123!";
  const name = "Test User";

  await page.goto("/auth/register");
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /sign up/i }).click();

  await page.waitForURL(/\/auth\/login/);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /log in/i }).click();

  await page.waitForURL(/\/app\/onboarding/);
  await page.getByRole("button", { name: "Next" }).nth(0).click();
  await page.getByRole("button", { name: "Next" }).nth(0).click();
  await page.getByRole("button", { name: /finish setup/i }).click();

  await page.waitForURL((url) => url.pathname === "/app");

  return { email, password, stamp };
}

export async function expectDashboard(page: Page) {
  await expect(page.getByText(/welcome back/i)).toBeVisible();
  await expect(page.getByText(/recent activity/i)).toBeVisible();
  await expect(page.getByText("Drafts", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/quick stats/i)).toBeVisible();
}
