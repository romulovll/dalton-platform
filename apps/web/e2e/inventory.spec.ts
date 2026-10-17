import { test, expect, Page } from "@playwright/test";

async function loginAs(page: Page) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@institutodalton.org.br");
  await page.getByLabel("Senha").fill("admin123");
  await page.getByRole("button", { name: /Entrar/i }).click();
  await page.waitForURL("/painel", { timeout: 30000 });
}

test.describe("Inventários Periódicos", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(60000);

  test("página de inventários carrega corretamente", async ({ page }) => {
    await loginAs(page);
    await page.goto("/inventarios");

    await expect(page.getByRole("heading", { name: "Inventários" })).toBeVisible();
    await expect(page.getByText("Levantamentos periódicos do acervo patrimonial")).toBeVisible();
    await expect(page.getByRole("link", { name: /Novo Inventário/i })).toBeVisible();
  });

  test("formulário de novo inventário exibe informações", async ({ page }) => {
    await loginAs(page);
    await page.goto("/inventarios/novo");

    await expect(page.getByRole("heading", { name: "Novo Inventário" })).toBeVisible();
    await expect(page.getByText("todos os bens ativos serão incluídos")).toBeVisible();
    await expect(page.getByRole("button", { name: /Iniciar Inventário/i })).toBeVisible();
  });

  test("iniciar novo inventário", async ({ page }) => {
    await loginAs(page);
    await page.goto("/inventarios/novo");

    await page.getByPlaceholder("Motivo do inventário").fill("Inventário anual 2026 — teste e2e");
    await page.getByRole("button", { name: /Iniciar Inventário/i }).click();

    // Should redirect to the inventory detail page
    await page.waitForURL(/\/inventarios\//, { timeout: 15000 });

    // Should show inventory code and items
    await expect(page.getByText(/INV-\d{4}-\d{3}/).first()).toBeVisible();
    await expect(page.getByText("Itens do Inventário")).toBeVisible();
    // Progress bar and summary cards
    await expect(page.getByText("verificados")).toBeVisible();
  });

  test("verificar item do inventário como localizado", async ({ page }) => {
    await loginAs(page);
    await page.goto("/inventarios");

    // Click on the most recent inventory
    await page.locator("a", { hasText: /INV-/ }).first().click();
    await page.waitForURL(/\/inventarios\//, { timeout: 10000 });

    // Click the green checkmark on the first item
    const firstRow = page.locator("table tbody tr").first();
    await firstRow.locator("button[title='Localizado']").click();

    // Wait for refresh and verify page still loads
    await page.waitForTimeout(2000);
    await expect(page.getByText("Itens do Inventário")).toBeVisible();
  });

  test("inventário aparece na listagem", async ({ page }) => {
    await loginAs(page);
    await page.goto("/inventarios");

    await expect(page.getByText(/INV-\d{4}-\d{3}/).first()).toBeVisible();
    await expect(page.getByText("Em Andamento").first()).toBeVisible();
  });
});
