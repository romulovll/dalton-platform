import { test, expect, Page } from "@playwright/test";

async function loginAs(page: Page) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@institutodalton.org.br");
  await page.getByLabel("Senha").fill("admin123");
  await page.getByRole("button", { name: /Entrar/i }).click();
  await page.waitForURL("/painel", { timeout: 30000 });
}

test.describe("Parcerias", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(60000);

  test("página de parcerias carrega corretamente", async ({ page }) => {
    await loginAs(page);
    await page.goto("/parcerias");

    await expect(page.getByRole("heading", { name: "Parcerias" })).toBeVisible();
    await expect(page.getByText("Termos de colaboração, fomento e convênios")).toBeVisible();
    await expect(page.getByRole("link", { name: /Nova Parceria/i })).toBeVisible();
  });

  test("formulário de nova parceria exibe campos corretos", async ({ page }) => {
    await loginAs(page);
    await page.goto("/parcerias/nova");

    await expect(page.getByRole("heading", { name: "Nova Parceria" })).toBeVisible();
    await expect(page.getByLabel("Número *")).toBeVisible();
    await expect(page.getByLabel("Órgão Parceiro *")).toBeVisible();
    await expect(page.getByLabel("Data de Início *")).toBeVisible();
    await expect(page.getByRole("button", { name: /Salvar Parceria/i })).toBeVisible();
  });

  test("cadastrar nova parceria", async ({ page }) => {
    await loginAs(page);
    await page.goto("/parcerias/nova");
    await page.waitForTimeout(1000);

    const suffix = Date.now().toString().slice(-6);
    await page.getByLabel("Número *").fill(`TC-E2E-${suffix}/2026`);

    // Select tipo
    const tipoGroup = page.locator(".space-y-2", { has: page.getByText("Tipo *", { exact: true }) });
    await tipoGroup.locator("[data-slot='select-trigger']").click();
    await page.getByRole("option", { name: "Termo de Colaboração" }).click();

    await page.getByLabel("Órgão Parceiro *").fill("Prefeitura de Presidente Epitácio");
    await page.getByLabel("Data de Início *").fill("2026-01-01");
    await page.getByLabel("Data de Encerramento").fill("2026-12-31");
    await page.getByLabel("Valor do Repasse (R$)").fill("50000");

    await page.getByRole("button", { name: /Salvar Parceria/i }).click();
    await page.waitForURL("/parcerias", { timeout: 15000 });

    await expect(page.getByText(/TC-E2E-\d+\/2026/).first()).toBeVisible();
  });

  test("parceria aparece na listagem com detalhes", async ({ page }) => {
    await loginAs(page);
    await page.goto("/parcerias");

    await expect(page.getByText(/TC-E2E-/).first()).toBeVisible();
    await expect(page.getByText("Prefeitura de Presidente Epitácio").first()).toBeVisible();
  });

  test("página de detalhe da parceria exibe informações", async ({ page }) => {
    await loginAs(page);
    await page.goto("/parcerias");

    await page.getByText(/TC-E2E-/).first().click();

    await expect(page.getByText("Bens Vinculados")).toBeVisible();
    await expect(page.getByRole("link", { name: /Editar/i })).toBeVisible();
  });
});
