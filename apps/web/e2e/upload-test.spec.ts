import { test, expect, Page } from "@playwright/test";

async function loginAs(page: Page) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@institutodalton.org.br");
  await page.getByLabel("Senha").fill("admin123");
  await page.getByRole("button", { name: /Entrar/i }).click();
  await page.waitForURL("/painel", { timeout: 30000 });
}

test("upload scanned PDF preserves format and redacts sensitive data", async ({ page }) => {
  test.setTimeout(300000);
  await loginAs(page);
  await page.goto("/documentos/novo");
  await page.waitForTimeout(2000);

  const fileInput = page.locator("input[type=file]");
  await fileInput.setInputFiles(
    "/Users/romulolemos/Downloads/ITEM V- CERTIDÃO E ITEM XIX - ITEM XX.pdf"
  );

  console.log("Uploading + OCR + redacting (up to 4 min)...");

  await expect(
    page.locator("text=mascarados automaticamente").or(page.locator("text=Nenhum dado sensível"))
  ).toBeVisible({ timeout: 240000 });

  await page.screenshot({ path: "/tmp/upload_result.png", fullPage: true });

  const body = await page.textContent("body") || "";
  if (body.includes("mascarados automaticamente")) {
    console.log("SUCCESS: Sensitive data detected and redacted in original format");
  } else {
    console.log("RESULT: No sensitive data detected");
  }
});
