import { test, expect } from "@playwright/test";
import { registerAndOnboard } from "./helpers";

test("exports return success", async ({ page }) => {
  await registerAndOnboard(page);

  await page.getByRole("link", { name: /opportunities/i }).click();
  await page.waitForURL(/\/app\/opportunities/);

  await page.getByLabel("Title").fill(`Idea ${Date.now()}`);
  await page.getByLabel("Details").fill("Export entry");
  await page.getByRole("button", { name: /add/i }).click();

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
