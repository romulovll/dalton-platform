import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for motion animations to complete
    await page.waitForTimeout(1500);
  });

  test("carrega a página inicial com o título correto", async ({ page }) => {
    await expect(page).toHaveTitle(/Instituto Dalton Salomão/);
  });

  test("exibe o hero com título e botões", async ({ page }) => {
    // Hero uses motion animations — wait for content to appear
    await expect(
      page.getByRole("heading", { name: /patrimônio/i }).first()
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Sistema de Gestão Patrimonial").first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Acessar Sistema/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Conhecer Funcionalidades/i })
    ).toBeVisible();
  });

  test("exibe a navbar com logo e links", async ({ page }) => {
    await expect(
      page.getByText("Instituto Dalton Salomão").first()
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Sobre/i }).first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Funcionalidades/i }).first()
    ).toBeVisible();
  });

  test("exibe a seção Sobre com o slogan", async ({ page }) => {
    const sobreSection = page.locator("#sobre");
    await expect(sobreSection).toBeVisible();
    await expect(page.getByText("Futuro se faz com amor").first()).toBeVisible();
  });

  test("exibe 6 cards de funcionalidades", async ({ page }) => {
    const section = page.locator("#funcionalidades");
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { name: "Cadastro de Bens" })).toBeVisible();
    await expect(section.getByRole("heading", { name: "Multi-Unidade" })).toBeVisible();
    await expect(section.getByRole("heading", { name: "QR Code e Etiquetas" })).toBeVisible();
    await expect(section.getByRole("heading", { name: "Controle de Depreciação" })).toBeVisible();
    await expect(section.getByRole("heading", { name: "Inventário Digital" })).toBeVisible();
    await expect(section.getByRole("heading", { name: "Prestação de Contas" })).toBeVisible();
  });

  test("exibe a seção Como Funciona com 4 passos", async ({ page }) => {
    const section = page.locator("#como-funciona");
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { name: "Acesse o Sistema" })).toBeVisible();
    await expect(section.getByRole("heading", { name: "Cadastre seus Bens" })).toBeVisible();
    await expect(section.getByRole("heading", { name: "Gerencie e Movimente" })).toBeVisible();
    await expect(section.getByRole("heading", { name: "Gere Relatórios" })).toBeVisible();
  });

  test("exibe a seção de estatísticas", async ({ page }) => {
    await expect(page.getByText("Categorias de Bens")).toBeVisible();
    await expect(page.getByText("Perfis de Acesso")).toBeVisible();
    await expect(page.getByText("Rastreabilidade")).toBeVisible();
    await expect(page.getByText("Lei em Conformidade")).toBeVisible();
  });

  test("exibe o CTA final", async ({ page }) => {
    await expect(
      page.getByText("Pronto para modernizar a gestão do patrimônio?")
    ).toBeVisible();
  });

  test("exibe o footer com informações de contato", async ({ page }) => {
    const footer = page.locator("#contato");
    await expect(footer).toBeVisible();
    await expect(footer.getByText("Presidente Epitácio")).toBeVisible();
    await expect(footer.getByText("(18) 2016-0104")).toBeVisible();
    await expect(
      page.getByText("2026 Instituto Dalton Salomão")
    ).toBeVisible();
  });

  test("botão Acessar Sistema direciona para /login", async ({ page }) => {
    await page
      .getByRole("link", { name: /Acessar Sistema/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("é responsivo — menu hamburger aparece em mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(
      page.getByRole("button", { name: /Menu de navegação/i })
    ).toBeVisible();
  });
});
