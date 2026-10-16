import { test, expect } from "@playwright/test";

test.describe("Proteção de Rotas (sem autenticação)", () => {
  const protectedRoutes = [
    "/painel",
    "/unidades",
    "/unidades/nova",
    "/bens",
    "/bens/novo",
    "/categorias",
    "/usuarios",
    "/movimentacoes",
    "/relatorios",
    "/configuracoes",
  ];

  for (const route of protectedRoutes) {
    test(`redireciona ${route} para /login quando não autenticado`, async ({
      page,
    }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login/);
    });
  }

  test("permite acesso à landing page sem autenticação", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
    // Wait for motion animations
    await page.waitForTimeout(1500);
    await expect(
      page.getByRole("heading", { name: /patrimônio/i }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("permite acesso à página de login sem autenticação", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(page).toHaveURL("/login");
    await expect(
      page.getByRole("heading", { name: /Acessar Sistema/i })
    ).toBeVisible();
  });
});
