import { test, expect } from "@playwright/test";

test.describe("Página de Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("exibe o formulário de login com logo", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Acessar Sistema/i })
    ).toBeVisible();
    await expect(page.getByText("Sistema de Gestão Patrimonial")).toBeVisible();
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await expect(page.getByLabel("Senha")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Entrar/i })
    ).toBeVisible();
  });

  test("exibe proteção reCAPTCHA", async ({ page }) => {
    await expect(
      page.getByText("Protegido por reCAPTCHA Enterprise")
    ).toBeVisible();
  });

  test("campos são obrigatórios", async ({ page }) => {
    const emailInput = page.getByLabel("E-mail");
    const senhaInput = page.getByLabel("Senha");
    await expect(emailInput).toHaveAttribute("required", "");
    await expect(senhaInput).toHaveAttribute("required", "");
  });

  test("link Voltar ao início leva à landing page", async ({ page }) => {
    await page.getByRole("link", { name: /Voltar ao início/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("logo linka para a página inicial", async ({ page }) => {
    await page.getByRole("link", { name: /Instituto Dalton Salomão/i }).click();
    await expect(page).toHaveURL("/");
  });
});
