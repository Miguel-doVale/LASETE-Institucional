import { test, expect } from '@playwright/test';
import { mockSupabase } from './supabase-fixture';

test('login valida senha, entra na área autorizada e sai', async ({ page }) => {
  await mockSupabase(page);
  await page.goto('/admin');
  await expect(
    page.getByRole('heading', { name: 'Entrar na LASETE' }),
  ).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Seções do painel' }),
  ).toHaveCount(0);
  await page
    .getByLabel('E-mail', { exact: true })
    .fill('felipe.admin@lasete.com');
  await page.getByLabel('Senha', { exact: true }).fill('wrong-password');
  await page.getByRole('button', { name: 'Mostrar senha' }).click();
  await expect(page.getByLabel('Senha', { exact: true })).toHaveAttribute(
    'type',
    'text',
  );
  await page.getByRole('button', { name: 'Entrar no painel' }).click();
  await expect(page.getByRole('alert')).toContainText(
    'E-mail ou senha incorretos',
  );
  await page.getByLabel('Senha', { exact: true }).fill('123456');
  await page.getByRole('button', { name: 'Entrar no painel' }).click();
  await expect(
    page.getByRole('navigation', { name: 'Seções do painel' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Editar Capture the Flag', exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: '.artifacts/admin-desktop.png',
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Sair da conta' }).click();
  await expect(
    page.getByRole('button', { name: 'Entrar no painel' }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Entrar no painel' }),
  ).toBeVisible();
});
test('conta autenticada sem autorização não entra', async ({ page }) => {
  await mockSupabase(page, { signedIn: true, admin: false });
  await page.goto('/admin');
  await expect(
    page.getByText('Esta conta ainda não tem permissão'),
  ).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Seções do painel' }),
  ).toHaveCount(0);
});
test('rascunho persiste, publica, exclui e mostra falha de gravação', async ({
  page,
}) => {
  const backend = await mockSupabase(page, { signedIn: true });
  await page.goto('/admin');
  await page
    .getByRole('button', { name: 'Adicionar projeto', exact: true })
    .click();
  await page
    .getByRole('dialog')
    .getByLabel('Título', { exact: true })
    .fill('Projeto de teste');
  await page.getByRole('button', { name: 'Salvar conteúdo' }).click();
  await expect(page.getByRole('status')).toContainText('Alterações salvas');
  await page.getByRole('button', { name: /Rascunhos/ }).click();
  await expect(
    page.getByRole('button', {
      name: 'Publicar Projeto de teste',
      exact: true,
    }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Editar Projeto de teste', exact: true }),
  ).toBeVisible();
  backend.failWrites = true;
  await page
    .getByRole('button', { name: 'Publicar Projeto de teste', exact: true })
    .click();
  await expect(page.getByRole('alert')).toContainText(
    'Não foi possível salvar',
  );
  backend.failWrites = false;
  await page
    .getByRole('button', { name: 'Publicar Projeto de teste', exact: true })
    .click();
  await expect(page.getByRole('status')).toContainText('Alterações salvas');
  await page
    .getByRole('button', { name: 'Excluir Projeto de teste', exact: true })
    .click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Excluir conteúdo', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Editar Projeto de teste', exact: true }),
  ).toHaveCount(0);
});
test('erro de carregamento bloqueia edição e permite tentar novamente', async ({
  page,
}) => {
  const backend = await mockSupabase(page, { signedIn: true });
  backend.failReads = true;
  await page.goto('/admin');
  await expect(page.getByText('Os conteúdos não carregaram')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Adicionar projeto', exact: true }),
  ).toBeDisabled();
  backend.failReads = false;
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(
    page.getByRole('button', { name: 'Editar Capture the Flag', exact: true }),
  ).toBeVisible();
});
test('login e painel funcionam no celular sem overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const state = await mockSupabase(page);
  await page.goto('/admin');
  await page.screenshot({
    path: '.artifacts/admin-login-mobile.png',
    fullPage: true,
  });
  await page
    .getByLabel('E-mail', { exact: true })
    .fill('felipe.admin@lasete.com');
  await page.getByLabel('Senha', { exact: true }).fill('123456');
  await page.getByRole('button', { name: 'Entrar no painel' }).click();
  await expect(
    page.getByRole('button', { name: 'Editar Capture the Flag', exact: true }),
  ).toBeVisible();
  expect(state.signedIn).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: '.artifacts/admin-mobile.png',
    fullPage: true,
  });
});

test('login de hardware cabe no viewport e mantém erro e controles acessíveis', async ({
  page,
}) => {
  await mockSupabase(page);
  await page.goto('/admin');
  await expect(
    page.getByRole('heading', { name: 'Entrar na LASETE' }),
  ).toBeVisible();
  await page
    .locator('.access-hardware')
    .evaluate(async (image: HTMLImageElement) => {
      await image.decode();
    });
  for (const [width, height] of [
    [1440, 900],
    [1366, 768],
    [1280, 720],
    [1024, 768],
    [768, 1024],
    [390, 844],
    [375, 667],
    [320, 568],
  ]) {
    await page.setViewportSize({ width, height });
    expect(
      await page.evaluate(() => ({
        x: document.documentElement.scrollWidth > innerWidth,
        y: document.documentElement.scrollHeight > innerHeight,
      })),
      `${width}x${height}`,
    ).toEqual({ x: false, y: false });
    await expect(
      page.getByRole('button', { name: 'Entrar no painel' }),
    ).toBeInViewport();
    if (width === 1440 || width === 390)
      await page.screenshot({
        path: `.artifacts/admin-login-hardware-${width}.png`,
        fullPage: true,
      });
  }
  await page.setViewportSize({ width: 375, height: 667 });
  await page
    .getByLabel('E-mail', { exact: true })
    .fill('felipe.admin@lasete.com');
  await page.getByLabel('Senha', { exact: true }).fill('wrong-password');
  await page.getByLabel('Senha', { exact: true }).press('Enter');
  await expect(page.getByRole('alert')).toContainText(
    'E-mail ou senha incorretos',
  );
  await expect(
    page.getByRole('button', { name: 'Entrar no painel' }),
  ).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollHeight <= innerHeight,
    ),
  ).toBe(true);
  await expect(
    page.getByRole('link', {
      name: /criar conta|sign up|google|facebook|app store|google play/i,
    }),
  ).toHaveCount(0);
  await page.setViewportSize({ width: 667, height: 375 });
  await page
    .getByRole('button', { name: 'Entrar no painel' })
    .scrollIntoViewIfNeeded();
  await expect(
    page.getByRole('button', { name: 'Entrar no painel' }),
  ).toBeInViewport();
});
