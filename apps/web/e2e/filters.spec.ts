import { test, expect, Page } from "@playwright/test";

async function loginAs(page: Page) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@institutodalton.org.br");
  await page.getByLabel("Senha").fill("admin123");
  await page.getByRole("button", { name: /Entrar/i }).click();
  await page.waitForURL("/painel", { timeout: 10000 });
}

test.describe("Busca e Filtros de Bens", () => {
  test.setTimeout(60000);

  test("página de bens exibe barra de busca e filtros", async ({ page }) => {
    await loginAs(page);
    await page.goto("/bens");

    await expect(page.getByPlaceholder("Buscar tombamento, descrição ou marca...")).toBeVisible();
    await expect(page.locator("select")).toHaveCount(3); // categoria, unidade, situação
  });

  test("busca por descrição retorna resultados", async ({ page }) => {
    await loginAs(page);
    await page.goto("/bens");

    await page.getByPlaceholder("Buscar tombamento, descrição ou marca...").fill("Notebook");
    await page.waitForTimeout(1000); // debounce

    await expect(page.getByText(/\d+ (bem|bens) encontrado/)).toBeVisible();
    await expect(page.getByText("Notebook").first()).toBeVisible();
  });

  test("filtro por situação funciona", async ({ page }) => {
    await loginAs(page);
    await page.goto("/bens?situacao=ATIVO");

    await expect(page.getByText(/\d+ (bem|bens) encontrado/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Limpar filtros" })).toBeVisible();
  });

  test("link limpar filtros retorna todos os bens", async ({ page }) => {
    await loginAs(page);
    await page.goto("/bens?situacao=ATIVO");

    await page.getByRole("link", { name: "Limpar filtros" }).click();
    await expect(page).toHaveURL("/bens");
  });
});
