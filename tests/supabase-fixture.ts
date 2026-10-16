import type { Page } from '@playwright/test';
import seed from './fixtures/content.json' with { type: 'json' };
const userId = '00000000-0000-0000-0000-000000000001';
const user = {
  id: userId,
  email: 'felipe.admin@lasete.com',
  aud: 'authenticated',
  role: 'authenticated',
  app_metadata: {},
  user_metadata: {},
  created_at: '2026-10-16T00:00:00Z',
};
const token = [
  Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString(
    'base64url',
  ),
  Buffer.from(
    JSON.stringify({ sub: userId, exp: 4102444800, role: 'authenticated' }),
  ).toString('base64url'),
  'test-signature',
].join('.');
const session = {
  access_token: token,
  refresh_token: 'test-refresh',
  expires_in: 3600,
  expires_at: 4102444800,
  token_type: 'bearer',
  user,
};
const mapping: Record<string, string> = {
  project: 'projects',
  research: 'researches',
  activity: 'activities',
  media: 'media',
  member: 'members',
  notice: 'notices',
};
export async function mockSupabase(
  page: Page,
  options: { signedIn?: boolean; admin?: boolean } = {},
) {
  const state = {
    signedIn: !!options.signedIn,
    admin: options.admin ?? true,
    failWrites: false,
    failReads: false,
    writes: 0,
    adminChecks: 0,
  };
  const tables: Record<string, Record<string, unknown>[]> = {};
  for (const table of Object.values(mapping)) tables[table] = [];
  seed.items.forEach((item, index) => {
    const { type, postCrop, ...rest } = item as typeof item & {
      postCrop?: boolean;
    };
    tables[mapping[type]].push({
      ...rest,
      post_crop: postCrop ?? false,
      sort_order: index,
    });
  });
  const s = seed.settings;
  tables.site_settings = [
    {
      id: 1,
      email: s.email,
      instagram: s.instagram,
      linkedin: s.linkedin,
      ai_url: s.aiUrl,
      selection_open: s.selectionOpen,
      selection_note: s.selectionNote,
      edital_url: s.editalUrl,
      form_url: s.formUrl,
    },
  ];
  if (options.signedIn)
    await page.addInitScript(
      (session) =>
        localStorage.setItem(
          'sb-gfbaidcldacxspesqdjy-auth-token',
          JSON.stringify(session),
        ),
      session,
    );
  await page.route('https://*.supabase.co/**', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const reply = (body: unknown, status = 200) =>
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    if (url.pathname.includes('/auth/v1/token')) {
      if (req.postDataJSON()?.password === 'wrong-password')
        return reply(
          { msg: 'Invalid login credentials', code: 'invalid_credentials' },
          400,
        );
      state.signedIn = true;
      return reply(session);
    }
    if (url.pathname.includes('/auth/v1/logout')) {
      state.signedIn = false;
      return reply({});
    }
    if (url.pathname.includes('/auth/v1/user')) return reply(user);
    if (url.pathname.includes('/storage/v1/object/'))
      return reply({ Key: 'test/image.webp' });
    const table = url.pathname.split('/').at(-1)!;
    const authorized = state.signedIn && state.admin;
    if (table === 'lasete_admins') {
      state.adminChecks++;
      return reply(authorized ? { user_id: userId } : null);
    }
    if (!tables[table]) return reply({ message: 'Unknown table' }, 404);
    if (req.method() === 'GET') {
      if (state.failReads) return reply({ message: 'Permission denied' }, 403);
      const rows = tables[table].filter(
        (x) =>
          (table === 'site_settings' || authorized || x.published) &&
          (!url.searchParams.has('id') ||
            String(x.id) === url.searchParams.get('id')?.slice(3)),
      );
      return reply(
        req.headers().accept?.includes('vnd.pgrst.object') ? rows[0] : rows,
      );
    }
    state.writes++;
    if (!authorized || state.failWrites)
      return reply({ message: 'Permission denied' }, 403);
    const id = url.searchParams.get('id')?.slice(3);
    if (req.method() === 'DELETE') {
      const row = tables[table].find((x) => x.id === id);
      tables[table] = tables[table].filter((x) => x.id !== id);
      return reply({ id: row?.id });
    }
    const body = req.postDataJSON();
    const row = {
      ...(tables[table].find((x) => String(x.id) === String(id || body.id)) ??
        {}),
      ...body,
    };
    tables[table] = tables[table].filter((x) => x.id !== row.id);
    tables[table].push(row);
    return reply({ id: row.id });
  });
  return Object.assign(state, { tables });
}
