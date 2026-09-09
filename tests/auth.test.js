import test from 'node:test';
import assert from 'node:assert/strict';
import { safeDestination, protectRoute } from '../src/lib/auth.js';
const privateRoute = { meta: { requiresAuth: true }, fullPath: '/world?source=dragon-arena' };
test('preserves internal destination and rejects external or looping redirects', () => {
  assert.equal(safeDestination('/world?source=dragon-arena'), '/world?source=dragon-arena');
  for (const value of ['https://evil.example', '//evil.example', '/\\evil.example', '/connect', '/reset-password', undefined, ['//evil.example']]) assert.equal(safeDestination(value), '/world');
});
test('public pages remain available without auth configuration', async () => {
  assert.equal(await protectRoute({ meta: {} }, null), true);
});
test('protected route rejects missing, failed and throwing auth checks', async () => {
  for (const client of [null, { auth: { getUser: async () => ({ data: { user: null }, error: null }) } }, { auth: { getUser: async () => { throw new Error('offline'); } } }, { auth: { getUser: async () => ({ data: { user: { id: 'x' } }, error: new Error('expired') }) } }]) {
    assert.deepEqual(await protectRoute(privateRoute, client), { path: '/connect', query: { next: privateRoute.fullPath } });
  }
});
test('protected route accepts verified user', async () => {
  assert.equal(await protectRoute(privateRoute, { auth: { getUser: async () => ({ data: { user: { id: 'x' } }, error: null }) } }), true);
});
