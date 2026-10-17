import { test, expect, Page } from "@playwright/test";

// Helper: login and get authenticated page
async function loginAs(page: Page) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@institutodalton.org.br");
  await page.getByLabel("Senha").fill("admin123");
  await page.getByRole("button", { name: /Entrar/i }).click();
  await page.waitForURL("/painel", { timeout: 30000 });
}

test.describe("App Shell (autenticado)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  test("login redireciona para o painel", async ({ page }) => {
    await expect(page).toHaveURL(/\/painel/);
  });

  test("painel exibe cards de estatísticas", async ({ page }) => {
    await expect(page.getByText("Total de Bens")).toBeVisible();
    await expect(page.getByText("Unidades ativas")).toBeVisible();
    await expect(page.getByText("Total registradas")).toBeVisible();
    await expect(page.getByText("Requerem atenção")).toBeVisible();
  });

  test("painel exibe ações rápidas", async ({ page }) => {
    await expect(page.getByText("Cadastrar Novo Bem")).toBeVisible();
    await expect(page.getByText("Cadastrar Nova Unidade")).toBeVisible();
  });

  test("sidebar exibe todos os menus de navegação", async ({ page }) => {
    const sidebar = page.locator("[data-slot='sidebar']");
    await expect(sidebar.getByText("Painel")).toBeVisible();
    await expect(sidebar.getByText("Unidades")).toBeVisible();
    await expect(sidebar.getByText("Bens")).toBeVisible();
    await expect(sidebar.getByText("Categorias")).toBeVisible();
    await expect(sidebar.getByText("Movimentações")).toBeVisible();
    await expect(sidebar.getByText("Parcerias")).toBeVisible();
    await expect(sidebar.getByText("Inventários")).toBeVisible();
    await expect(sidebar.getByText("Usuários")).toBeVisible();
    await expect(sidebar.getByText("Relatórios")).toBeVisible();
    await expect(sidebar.getByText("Auditoria")).toBeVisible();
    await expect(sidebar.getByText("Configurações")).toBeVisible();
  });

  test("navegar para Unidades via sidebar", async ({ page }) => {
    await page.getByRole("link", { name: "Unidades" }).click();
    await expect(page).toHaveURL(/\/unidades/);
    await expect(
      page.getByRole("heading", { name: "Unidades" })
    ).toBeVisible();
  });

  test("navegar para Bens via sidebar", async ({ page }) => {
    await page.getByRole("link", { name: "Bens" }).click();
    await expect(page).toHaveURL(/\/bens/);
    await expect(
      page.getByRole("heading", { name: "Bens Patrimoniais" })
    ).toBeVisible();
  });

  test("navegar para Categorias via sidebar", async ({ page }) => {
    await page.getByRole("link", { name: "Categorias" }).click();
    await expect(page).toHaveURL(/\/categorias/);
    await expect(
      page.getByRole("heading", { name: /Categorias/ })
    ).toBeVisible();
  });

  test("navegar para Usuários via sidebar", async ({ page }) => {
    await page.getByRole("link", { name: "Usuários" }).click();
    await expect(page).toHaveURL(/\/usuarios/);
    await expect(
      page.getByRole("heading", { name: "Usuários" })
    ).toBeVisible();
  });

  test("navegar para Configurações via sidebar", async ({ page }) => {
    await page.getByRole("link", { name: "Configurações" }).click();
    await expect(page).toHaveURL(/\/configuracoes/);
    await expect(
      page.getByRole("heading", { name: "Configurações" })
    ).toBeVisible();
  });

  test("página de Nova Unidade carrega o formulário completo", async ({
    page,
  }) => {
    await page.goto("/unidades/nova");
    await expect(
      page.getByRole("heading", { name: "Nova Unidade" })
    ).toBeVisible();
    await expect(page.getByLabel("Código da Unidade")).toBeVisible();
    await expect(page.getByLabel(/Nome da Unidade/)).toBeVisible();
    await expect(page.getByLabel(/Responsável/)).toBeVisible();
    await expect(page.getByLabel("Telefone")).toBeVisible();
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await expect(page.getByLabel(/Logradouro/)).toBeVisible();
    await expect(page.getByLabel(/Cidade/)).toBeVisible();
  });

  test("página de Novo Bem carrega o formulário completo", async ({
    page,
  }) => {
    await page.goto("/bens/novo");
    await expect(
      page.getByRole("heading", { name: "Cadastrar Novo Bem" })
    ).toBeVisible();
    await expect(page.getByText("IDS-NNNNNN")).toBeVisible();
    await expect(page.getByText("Identificação do Bem")).toBeVisible();
    await expect(page.getByText("Dados de Aquisição")).toBeVisible();
    await expect(page.getByText("Estado e Responsável")).toBeVisible();
    await expect(page.getByText("Conformidade Legal")).toBeVisible();
    await expect(page.getByText("Cláusula de Inalienabilidade")).toBeVisible();
    await expect(page.getByText("Bem Remanescente")).toBeVisible();
    await expect(page.getByText("Foto e Observações")).toBeVisible();
  });

  test("Movimentações exibe listagem de movimentações", async ({
    page,
  }) => {
    await page.goto("/movimentacoes");
    await expect(page.getByRole("heading", { name: "Movimentações" })).toBeVisible();
    await expect(page.getByText("Transferências, baixas e manutenções de bens")).toBeVisible();
    await expect(page.getByRole("link", { name: /Nova Movimentação/i })).toBeVisible();
  });

  test("Relatórios exibe cards de resumo e depreciação", async ({
    page,
  }) => {
    await page.goto("/relatorios");
    await expect(page.getByRole("heading", { name: "Relatórios" })).toBeVisible();
    await expect(page.getByText("Total de Bens Ativos")).toBeVisible();
    await expect(page.getByText("Demonstrativo de Depreciação")).toBeVisible();
  });

  test("Configurações exibe dados da organização", async ({ page }) => {
    await page.goto("/configuracoes");
    await expect(page.getByText("Dados da Organização")).toBeVisible();
    await expect(page.getByLabel("Nome")).toBeVisible();
    await expect(page.getByLabel("CNPJ")).toBeVisible();
    await expect(page.getByLabel("Prefixo")).toBeVisible();
  });
});
