import { test, expect, Page } from "@playwright/test";

async function loginAs(page: Page) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@institutodalton.org.br");
  await page.getByLabel("Senha").fill("admin123");
  await page.getByRole("button", { name: /Entrar/i }).click();
  await page.waitForURL("/painel", { timeout: 30000 });
}

test.describe("Phase 4 — Bulk QR, Import, Charts, PDF", () => {
  test.setTimeout(60000);

  test("bens listing has checkboxes for bulk QR", async ({ page }) => {
    await loginAs(page);
    await page.goto("/bens");

    // Should have checkboxes
    await expect(page.locator("input[type='checkbox']").first()).toBeVisible();
  });

  test("selecting assets shows bulk print button", async ({ page }) => {
    await loginAs(page);
    await page.goto("/bens");

    // Click first checkbox (select all)
    await page.locator("input[type='checkbox']").first().click();

    await expect(page.getByText(/selecionado/)).toBeVisible();
    await expect(page.getByRole("button", { name: /Imprimir Etiquetas/i })).toBeVisible();
  });

  test("bens page has import CSV button", async ({ page }) => {
    await loginAs(page);
    await page.goto("/bens");

    await expect(page.getByRole("link", { name: /Importar CSV/i })).toBeVisible();
  });

  test("import page loads correctly", async ({ page }) => {
    await loginAs(page);
    await page.goto("/bens/importar");

    await expect(page.getByRole("heading", { name: "Importar Bens" })).toBeVisible();
    await expect(page.getByText("Upload do Arquivo")).toBeVisible();
    await expect(page.getByText("Formato esperado")).toBeVisible();
    await expect(page.getByRole("button", { name: /Selecionar Arquivo/i })).toBeVisible();
  });

  test("dashboard shows charts when assets exist", async ({ page }) => {
    await loginAs(page);
    await page.goto("/painel");

    await expect(page.getByText("Bens por Categoria")).toBeVisible();
    await expect(page.getByText("Distribuição por Unidade")).toBeVisible();
    await expect(page.getByText("Valor por Categoria")).toBeVisible();
  });

  test("reports page has PDF export button", async ({ page }) => {
    await loginAs(page);
    await page.goto("/relatorios");

    await expect(page.getByRole("link", { name: /Imprimir.*PDF/i })).toBeVisible();
  });

  test("PDF report API returns HTML", async ({ page }) => {
    await loginAs(page);

    const cookies = await page.context().cookies();
    const response = await page.request.get("/api/relatorio-pdf", {
      headers: {
        cookie: cookies.map((c) => `${c.name}=${c.value}`).join("; "),
      },
    });

    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("text/html");

    const body = await response.text();
    expect(body).toContain("Relatório Patrimonial");
    expect(body).toContain("Notas Explicativas");
    expect(body).toContain("ITG 2002");
  });
});
