import { test, expect, Page } from "@playwright/test";

async function loginAs(page: Page) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@institutodalton.org.br");
  await page.getByLabel("Senha").fill("admin123");
  await page.getByRole("button", { name: /Entrar/i }).click();
  await page.waitForURL("/painel", { timeout: 30000 });
}

test.describe("Auditoria", () => {
  test.setTimeout(60000);

  test("página de auditoria carrega corretamente", async ({ page }) => {
    await loginAs(page);
    await page.goto("/auditoria");

    await expect(page.getByRole("heading", { name: "Auditoria" })).toBeVisible();
    await expect(page.getByText("Registro de todas as ações realizadas no sistema")).toBeVisible();
  });

  test("filtros de entidade estão presentes", async ({ page }) => {
    await loginAs(page);
    await page.goto("/auditoria");

    // Filter pills area (not sidebar)
    const filterArea = page.locator(".flex.gap-2.flex-wrap");
    await expect(filterArea.getByText("Todos")).toBeVisible();
    await expect(filterArea.getByText("Bem Patrimonial")).toBeVisible();
    await expect(filterArea.getByText("Movimentação")).toBeVisible();
  });

  test("tabela de auditoria exibe cabeçalhos corretos", async ({ page }) => {
    await loginAs(page);
    await page.goto("/auditoria");

    await expect(page.getByText("de auditoria")).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Data/Hora" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Ação" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Entidade" })).toBeVisible();
  });
});
