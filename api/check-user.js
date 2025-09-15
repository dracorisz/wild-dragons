// api/check-user.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Only safe on the server!
);

export default async function handler(req, res) {
  const email = req.query.email || req.body?.email;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const { data, error } = await supabase.auth.admin.getUserByEmail(email);
  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ user: data.user });
}
