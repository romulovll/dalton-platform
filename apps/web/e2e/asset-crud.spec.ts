import { test, expect, Page } from "@playwright/test";

async function loginAs(page: Page) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@institutodalton.org.br");
  await page.getByLabel("Senha").fill("admin123");
  await page.getByRole("button", { name: /Entrar/i }).click();
  await page.waitForURL("/painel", { timeout: 30000 });
}

async function pickSelect(page: Page, labelText: string, optionText: string | RegExp) {
  // Find the label, then click the select trigger in the same form group
  const group = page.locator(".space-y-2", { has: page.getByText(labelText, { exact: true }) });
  await group.locator("[data-slot='select-trigger']").click();
  await page.getByRole("option", { name: optionText }).click();
}

test.describe("CRUD de Bens Patrimoniais", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(60000);

  test("cadastrar um novo bem com todos os campos obrigatórios", async ({
    page,
  }) => {
    await loginAs(page);
    await page.goto("/bens/novo");

    await expect(page.getByText("Identificação do Bem")).toBeVisible();
    // Wait for /api/form-data to populate selects
    await page.waitForTimeout(2000);

    // Identificação
    await pickSelect(page, "Unidade *", /Sede Presidente Epitácio/i);
    await page.getByPlaceholder("Ex: Secretaria, Sala 01").fill("Secretaria");
    await page.getByPlaceholder("Ex: Notebook Dell Latitude 5540").fill("Notebook Dell Teste E2E v2");
    await pickSelect(page, "Categoria *", /Equipamentos de Informática/i);
    await page.waitForTimeout(500);
    await pickSelect(page, "Tipo de Item *", "Notebook");
    await page.getByPlaceholder("Ex: Dell").fill("Dell");
    await page.getByPlaceholder("Ex: Latitude 5540").fill("Latitude 5540");
    await page.getByPlaceholder("S/N").fill("SN-E2E-001");

    // Aquisição
    await page.getByLabel("Data de Aquisição").fill("2026-01-15");
    await page.getByPlaceholder("0,00").first().fill("5200");
    await pickSelect(page, "Forma de Aquisição *", "Compra");
    await page.getByPlaceholder("Número da NF").fill("NF-001");
    await page.getByPlaceholder("Nome do fornecedor").fill("Dell Brasil");
    await pickSelect(page, "Origem dos Recursos *", "Recursos Próprios");

    // Estado e Responsável
    await page.getByPlaceholder("Nome do responsável").fill("Maria Silva");
    await pickSelect(page, "Estado de Conservação *", "Excelente");

    // Observações
    await page.getByPlaceholder("Informações adicionais").fill("Teste e2e");

    // Submit
    await page.getByRole("button", { name: /Salvar Bem/i }).click();
    await page.waitForURL("/bens", { timeout: 15000 });
  });

  test("bem aparece na listagem com tombamento IDS-", async ({
    page,
  }) => {
    await loginAs(page);
    await page.goto("/bens");

    await expect(page.getByText("Notebook Dell Teste E2E v2").first()).toBeVisible();
    await expect(page.getByText("Maria Silva").first()).toBeVisible();
    await expect(page.locator("text=/IDS-\\d{6}/").first()).toBeVisible();
  });

  test("página de detalhe do bem exibe todas as informações", async ({
    page,
  }) => {
    await loginAs(page);
    await page.goto("/bens");
    // Click the tombamento link in the same row as our asset
    const row = page.locator("tr", { hasText: "Notebook Dell Teste E2E v2" });
    await row.locator("a").first().click();

    await expect(page.getByText("Notebook Dell Teste E2E v2").first()).toBeVisible();
    await expect(page.getByText("Identificação")).toBeVisible();
    await expect(page.getByText("Equipamentos de Informática")).toBeVisible();
    await expect(page.getByText("SN-E2E-001")).toBeVisible();
    await expect(page.getByText("Localização e Responsável")).toBeVisible();
    await expect(page.getByText("Sede Presidente Epitácio")).toBeVisible();
    await expect(page.getByText("Secretaria")).toBeVisible();
    await expect(page.getByText("Maria Silva")).toBeVisible();
    await expect(page.getByText("Dados de Aquisição")).toBeVisible();
    await expect(page.getByText("NF-001")).toBeVisible();
    await expect(page.getByText("Depreciação e Conformidade")).toBeVisible();
  });

  test("botão QR Code está presente na página de detalhe", async ({
    page,
  }) => {
    await loginAs(page);
    await page.goto("/bens");
    const row = page.locator("tr", { hasText: "Notebook Dell Teste E2E v2" });
    await row.locator("a").first().click();

    const qrButton = page.getByRole("link", { name: /Etiqueta QR/i });
    await expect(qrButton).toBeVisible();
    const href = await qrButton.getAttribute("href");
    expect(href).toContain("/api/etiquetas?ids=");
  });

  test("dashboard mostra o bem cadastrado", async ({ page }) => {
    await loginAs(page);
    await page.goto("/painel");

    await expect(page.getByText("Notebook Dell Teste E2E v2").first()).toBeVisible();
  });

  test("API de etiquetas gera QR Code", async ({ page }) => {
    await loginAs(page);
    await page.goto("/bens");

    // Get first asset link
    const link = page.locator("a[href^='/bens/c']").first();
    const href = await link.getAttribute("href");
    const id = href!.replace("/bens/", "");

    const response = await page.goto(`/api/etiquetas?ids=${id}`);
    expect(response?.status()).toBe(200);

    const html = await page.content();
    expect(html).toContain("IDS-");
    expect(html).toContain("Imprimir Etiquetas");
  });
});
