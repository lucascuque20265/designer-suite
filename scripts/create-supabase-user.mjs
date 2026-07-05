#!/usr/bin/env node
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/create-supabase-user.mjs email@example.com "P@ssw0rd"

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
  process.exit(1);
}

const email = process.argv[2] || process.env.CREATE_USER_EMAIL;
const password = process.argv[3] || process.env.CREATE_USER_PASSWORD;

if (!email || !password) {
  console.error('Usage: node scripts/create-supabase-user.mjs <email> <password>');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

async function run() {
  try {
    // create user via admin API
    const { data: userData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createErr) {
      console.error('Failed to create user:', createErr.message || createErr);
      process.exit(1);
    }
    const user = userData || (userData?.user ?? null);
    const userId = user?.id || user?.user?.id;
    if (!userId) {
      console.log('User created but no id returned; check Supabase response:', userData);
    } else {
      console.log('User created, id:', userId);
      // grant admin role in user_roles table
      const { error: roleErr } = await supabaseAdmin.from('user_roles').insert({ user_id: userId, role: 'admin' });
      if (roleErr) {
        console.error('Failed to insert user_roles row:', roleErr.message || roleErr);
        process.exit(1);
      }
      console.log('Assigned admin role to user.');
    }
    console.log('Done.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
