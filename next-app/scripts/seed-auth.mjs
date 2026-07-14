// One-off script (not a repeatable migration): creates the seeded auth users
// via the Admin API, since auth.users can't be seeded through seed.sql
// against a hosted (non-local) Supabase project. Run once with:
//   node --env-file=.env.local scripts/seed-auth.mjs
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.');
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Demo-only credentials, all seeded accounts share one password for ease of
// manual testing. Not meant to survive past this mock-data phase.
const SEED_PASSWORD = 'Alwahab123!';

const CUSTOMERS = [
{ email: 'ayesha.khan@example.com', name: 'Ayesha Khan', phone: '0300-1234567', address: { label: 'Home', line1: 'House 12, Street 4, DHA Phase 5', city: 'Lahore', phone: '0300-1234567' } },
{ email: 'bilal.ahmed@example.com', name: 'Bilal Ahmed', phone: '0311-9876543', address: { label: 'Home', line1: 'Flat 3B, Clifton Block 2', city: 'Karachi', phone: '0311-9876543' } },
{ email: 'sara.malik@example.com', name: 'Sara Malik', phone: '0321-4567890', address: { label: 'Home', line1: 'B-45, Gulberg III', city: 'Lahore', phone: '0321-4567890' } }];

const ADMIN = { email: 'admin@alwahab.pk', name: 'Store Admin' };

async function createAuthUser(email, metadata) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: SEED_PASSWORD,
    email_confirm: true,
    user_metadata: metadata
  });
  if (error) throw new Error(`createUser(${email}): ${error.message}`);
  return data.user;
}

async function main() {
  for (const c of CUSTOMERS) {
    const user = await createAuthUser(c.email, { name: c.name, phone: c.phone });
    console.log(`Created customer ${c.email} (${user.id})`);

    const { error: addrError } = await supabase.from('addresses').insert({
      user_id: user.id,
      label: c.address.label,
      line1: c.address.line1,
      city: c.address.city,
      phone: c.address.phone
    });
    if (addrError) throw new Error(`insert address(${c.email}): ${addrError.message}`);
  }

  const admin = await createAuthUser(ADMIN.email, { name: ADMIN.name });
  const { error: adminError } = await supabase.from('admins').insert({
    id: admin.id,
    name: ADMIN.name,
    email: ADMIN.email
  });
  if (adminError) throw new Error(`insert admins row: ${adminError.message}`);
  console.log(`Created admin ${ADMIN.email} (${admin.id})`);

  console.log(`\nAll seed accounts share the password: ${SEED_PASSWORD}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
