import { test, expect, Page } from "@playwright/test";

async function loginAs(page: Page) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@institutodalton.org.br");
  await page.getByLabel("Senha").fill("admin123");
  await page.getByRole("button", { name: /Entrar/i }).click();
  await page.waitForURL("/painel", { timeout: 10000 });
}

test.describe("Relatórios e Depreciação", () => {
  test.setTimeout(60000);

  test("página de relatórios carrega com cards de resumo", async ({ page }) => {
    await loginAs(page);
    await page.goto("/relatorios");

    await expect(page.getByRole("heading", { name: "Relatórios" })).toBeVisible();
    await expect(page.getByText("Total de Bens Ativos")).toBeVisible();
    await expect(page.getByText("Valor Total de Aquisição")).toBeVisible();
    await expect(page.getByText("Depreciação Acumulada")).toBeVisible();
    await expect(page.getByText("Valor Contábil Líquido")).toBeVisible();
  });

  test("tabela de depreciação exibe bens cadastrados", async ({ page }) => {
    await loginAs(page);
    await page.goto("/relatorios");

    await expect(page.getByText("Demonstrativo de Depreciação")).toBeVisible();
    // Should have at least one asset row
    await expect(page.locator("table tbody tr").first()).toBeVisible();
    // Verify depreciation-specific column header
    await expect(page.getByRole("columnheader", { name: "Depreciação" }).first()).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "%" })).toBeVisible();
  });

  test("botão calcular depreciação está presente", async ({ page }) => {
    await loginAs(page);
    await page.goto("/relatorios");

    await expect(
      page.getByRole("button", { name: /Calcular Depreciação Mensal/i })
    ).toBeVisible();
  });

  test("botão exportar CSV está presente", async ({ page }) => {
    await loginAs(page);
    await page.goto("/relatorios");

    await expect(page.getByText("Exportar CSV")).toBeVisible();
  });

  test("API de CSV retorna arquivo válido", async ({ page }) => {
    await loginAs(page);

    // Use request context (avoids download interception issue)
    const cookies = await page.context().cookies();
    const response = await page.request.get("/api/relatorio-csv", {
      headers: {
        cookie: cookies.map((c) => `${c.name}=${c.value}`).join("; "),
      },
    });

    expect(response.status()).toBe(200);

    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("text/csv");

    const disposition = response.headers()["content-disposition"];
    expect(disposition).toContain("relatorio_patrimonial_");
    expect(disposition).toContain(".csv");

    const body = await response.text();
    expect(body).toContain("Tombamento");
    expect(body).toContain("Categoria");
    expect(body).toContain("IDS-");
  });

  test("calcular depreciação mensal funciona", async ({ page }) => {
    await loginAs(page);
    await page.goto("/relatorios");

    // Click the depreciation button
    await page.getByRole("button", { name: /Calcular Depreciação Mensal/i }).click();

    // Page should reload/refresh and still show the reports
    await expect(page.getByText("Demonstrativo de Depreciação")).toBeVisible({ timeout: 15000 });
  });
});
