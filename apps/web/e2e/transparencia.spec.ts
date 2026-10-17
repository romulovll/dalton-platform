import { test, expect, Page } from "@playwright/test";

async function loginAs(page: Page) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@institutodalton.org.br");
  await page.getByLabel("Senha").fill("admin123");
  await page.getByRole("button", { name: /Entrar/i }).click();
  await page.waitForURL("/painel", { timeout: 30000 });
}

test.describe("Portal de Transparência (público)", () => {
  test.setTimeout(60000);

  test("página de transparência carrega sem autenticação", async ({ page }) => {
    await page.goto("/transparencia");

    await expect(page.getByRole("heading", { name: "Portal de Transparência" })).toBeVisible();
    await expect(page.getByText("Compromisso com a transparência")).toBeVisible();
    await expect(page.getByText("Lei 13.019/2014")).toBeVisible();
  });

  test("landing page tem botão de transparência", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: /Portal de Transparência/i })).toBeVisible();
  });

  test("navbar tem link de transparência", async ({ page }) => {
    await page.goto("/");

    const nav = page.locator("nav");
    await expect(nav.getByText("Transparência", { exact: true }).first()).toBeVisible();
  });

  test("exibe aviso de conformidade legal", async ({ page }) => {
    await page.goto("/transparencia");

    await expect(page.getByText("Lei 9.790/1999")).toBeVisible();
    await expect(page.getByText("ITG 2002")).toBeVisible();
  });
});

test.describe("Documentos (admin)", () => {
  test.setTimeout(60000);

  test("página de documentos carrega corretamente", async ({ page }) => {
    await loginAs(page);
    await page.goto("/documentos");

    await expect(page.getByRole("heading", { name: "Documentos" })).toBeVisible();
    await expect(page.getByText("Gerencie os documentos do Portal de Transparência")).toBeVisible();
    await expect(page.getByRole("link", { name: /Novo Documento/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Ver Portal Público/i })).toBeVisible();
  });

  test("formulário de novo documento exibe campos corretos", async ({ page }) => {
    await loginAs(page);
    await page.goto("/documentos/novo");

    await expect(page.getByRole("heading", { name: "Novo Documento" })).toBeVisible();
    await expect(page.getByLabel("Título *")).toBeVisible();
    await expect(page.getByText("Categoria *")).toBeVisible();
    await expect(page.getByText("Ano *")).toBeVisible();
    await expect(page.getByText("Publicado")).toBeVisible();
    await expect(page.getByText("Arquivo *")).toBeVisible();
    await expect(page.getByRole("button", { name: /Selecionar Arquivo/i })).toBeVisible();
  });

  test("sidebar tem link de documentos", async ({ page }) => {
    await loginAs(page);
    await page.goto("/painel");

    const sidebar = page.locator("[data-slot='sidebar']");
    await expect(sidebar.getByText("Documentos")).toBeVisible();
  });
});
