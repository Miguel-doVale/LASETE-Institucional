// Run locally only. Never import this script into the frontend.
// node --env-file=.env.local --env-file=.env.admin.local scripts/create-test-admins.mjs
import { createClient } from '@supabase/supabase-js';
const url = process.env.VITE_SUPABASE_URL;
const key =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error(
    'Configure VITE_SUPABASE_URL em .env.local e SUPABASE_SECRET_KEY em .env.admin.local. A chave secreta fica apenas no computador, sem prefixo VITE_.',
  );
  process.exit(1);
}
const client = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const emails = [
  'felipe.admin@lasete.com',
  'pedro.admin@lasete.com',
  'aguiar.admin@lasete.com',
];
const password = process.env.LASETE_TEST_ADMIN_PASSWORD || '123456';
const existing = new Map();
for (let page = 1; ; page++) {
  const { data, error } = await client.auth.admin.listUsers({
    page,
    perPage: 100,
  });
  if (error) throw error;
  for (const user of data.users)
    if (emails.includes(user.email)) existing.set(user.email, user);
  if (data.users.length < 100) break;
}
for (const email of emails) {
  let user = existing.get(email);
  if (!user) {
    const { data, error } = await client.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    user = data.user;
  }
  const { error } = await client
    .from('lasete_admins')
    .upsert({ user_id: user.id });
  if (error) throw error;
  console.log(
    `${email}: autorizado${existing.has(email) ? ' (senha existente preservada)' : ' com a senha de teste'}.`,
  );
}
