import { test, expect, Page } from "@playwright/test";

async function loginAs(page: Page) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@institutodalton.org.br");
  await page.getByLabel("Senha").fill("admin123");
  await page.getByRole("button", { name: /Entrar/i }).click();
  await page.waitForURL("/painel", { timeout: 30000 });
}

async function pickSelect(page: Page, labelText: string, optionText: string | RegExp) {
  const group = page.locator(".space-y-2", { has: page.getByText(labelText, { exact: true }) });
  await group.locator("[data-slot='select-trigger']").click();
  await page.getByRole("option", { name: optionText }).first().click();
}

test.describe("Movimentações", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(60000);

  test("página de movimentações carrega corretamente", async ({ page }) => {
    await loginAs(page);
    await page.goto("/movimentacoes");

    await expect(page.getByRole("heading", { name: "Movimentações" })).toBeVisible();
    await expect(page.getByText("Transferências, baixas e manutenções de bens")).toBeVisible();
    await expect(page.getByRole("link", { name: /Nova Movimentação/i })).toBeVisible();
  });

  test("formulário de nova movimentação exibe 3 abas", async ({ page }) => {
    await loginAs(page);
    await page.goto("/movimentacoes/nova");

    await expect(page.getByRole("heading", { name: "Nova Movimentação" })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Transferência/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Baixa/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Manutenção/i })).toBeVisible();
  });

  test("aba de transferência exibe campos corretos", async ({ page }) => {
    await loginAs(page);
    await page.goto("/movimentacoes/nova");
    await page.waitForTimeout(2000);

    // Default tab is Transferência
    await expect(page.getByText("Transferência de Bem")).toBeVisible();
    await expect(page.getByText("Tipo de Transferência", { exact: false })).toBeVisible();
    await expect(page.getByText("Unidade de Destino")).toBeVisible();
    await expect(page.getByRole("button", { name: /Registrar Transferência/i })).toBeVisible();
  });

  test("aba de baixa exibe campos corretos e aviso", async ({ page }) => {
    await loginAs(page);
    await page.goto("/movimentacoes/nova");

    await page.getByRole("tab", { name: /Baixa/i }).click();

    await expect(page.getByText("Baixa de Bem")).toBeVisible();
    await expect(page.getByText("Motivo da Baixa", { exact: false })).toBeVisible();
    await expect(page.getByText("Documento Autorizador")).toBeVisible();
    await expect(page.getByText("altera permanentemente")).toBeVisible();
    await expect(page.getByRole("button", { name: /Registrar Baixa/i })).toBeVisible();
  });

  test("aba de manutenção exibe campos corretos", async ({ page }) => {
    await loginAs(page);
    await page.goto("/movimentacoes/nova");

    await page.getByRole("tab", { name: /Manutenção/i }).click();

    await expect(page.getByText("Manutenção de Bem")).toBeVisible();
    await expect(page.getByText("Descrição do Serviço", { exact: false })).toBeVisible();
    await expect(page.getByText("Custo (R$)")).toBeVisible();
    await expect(page.getByText("Retorno Previsto")).toBeVisible();
    await expect(page.getByRole("button", { name: /Registrar Manutenção/i })).toBeVisible();
  });

  test("registrar envio para manutenção", async ({ page }) => {
    await loginAs(page);
    await page.goto("/movimentacoes/nova");
    await page.waitForTimeout(2000);

    await page.getByRole("tab", { name: /Manutenção/i }).click();

    // Select the first bem
    await pickSelect(page, "Bem *", /IDS-/);

    // Fill maintenance details
    await page.getByPlaceholder("O que precisa ser consertado/feito...").fill("Troca de tela — teste e2e");
    await page.getByPlaceholder("0,00").fill("350");

    await page.getByRole("button", { name: /Registrar Manutenção/i }).click();
    await page.waitForURL("/movimentacoes", { timeout: 15000 });

    // Verify it appears in the listing
    await expect(page.getByText("Envio p/ Manutenção").first()).toBeVisible();
  });

  test("movimentação aparece na listagem", async ({ page }) => {
    await loginAs(page);
    await page.goto("/movimentacoes");

    // At least one movement should exist from previous test
    await expect(page.getByText("Envio p/ Manutenção").first()).toBeVisible();
  });
});
