import { test } from "@playwright/test";
import { registerAndOnboard, expectDashboard } from "./helpers";

test("onboarding and dashboard widgets", async ({ page }) => {
  await registerAndOnboard(page);
  await expectDashboard(page);
});
