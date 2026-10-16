import { test, expect, Page } from "@playwright/test";

async function loginAs(page: Page) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@institutodalton.org.br");
  await page.getByLabel("Senha").fill("admin123");
  await page.getByRole("button", { name: /Entrar/i }).click();
  await page.waitForURL("/painel", { timeout: 10000 });
}

test.describe("Notas Explicativas (ITG 2002)", () => {
  test.setTimeout(60000);

  test("seção de notas explicativas aparece na página de relatórios", async ({ page }) => {
    await loginAs(page);
    await page.goto("/relatorios");

    await expect(page.getByText("Notas Explicativas (ITG 2002)")).toBeVisible();
  });

  test("resumo do patrimônio está presente", async ({ page }) => {
    await loginAs(page);
    await page.goto("/relatorios");

    await expect(page.getByText("1. Resumo do Patrimônio")).toBeVisible();
    await expect(page.getByText("Com Cláusula de Inalienabilidade")).toBeVisible();
    await expect(page.getByText("Bens Remanescentes").last()).toBeVisible();
  });

  test("composição por categoria está presente", async ({ page }) => {
    await loginAs(page);
    await page.goto("/relatorios");

    await expect(page.getByText("Composição por Categoria e Critérios de Depreciação")).toBeVisible();
  });

  test("origem dos recursos está presente", async ({ page }) => {
    await loginAs(page);
    await page.goto("/relatorios");

    await expect(page.getByText("Origem dos Recursos")).toBeVisible();
  });

  test("forma de aquisição está presente", async ({ page }) => {
    await loginAs(page);
    await page.goto("/relatorios");

    await expect(page.getByText("Forma de Aquisição")).toBeVisible();
  });

  test("critérios contábeis estão documentados", async ({ page }) => {
    await loginAs(page);
    await page.goto("/relatorios");

    await expect(page.getByText("Critérios contábeis")).toBeVisible();
    await expect(page.getByText("método linear")).toBeVisible();
    await expect(page.getByText("NBC TG 27")).toBeVisible();
    await expect(page.getByText("ITG 2002 (R1)")).toBeVisible();
  });
});
