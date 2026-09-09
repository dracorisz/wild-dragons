export function safeDestination(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u0020]/.test(value)) return '/world';
  if (/^\/(connect|reset-password)(?:[/?#]|$)/.test(value)) return '/world';
  return value;
}

export async function protectRoute(to, client) {
  if (!to.meta.requiresAuth) return true;
  try {
    if (client) {
      const { data, error } = await client.auth.getUser();
      if (!error && data?.user) return true;
    }
  } catch {
    // A failed auth check must not grant access.
  }
  return { path: '/connect', query: { next: to.fullPath } };
}
