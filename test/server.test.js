import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const port = 3100 + Math.floor(Math.random() * 500);
let server;

test.before(async () => {
  server = spawn(process.execPath, ['server.js'], { cwd: process.cwd(), env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
  await Promise.race([
    once(server.stdout, 'data'),
    once(server, 'error').then(([error]) => Promise.reject(error)),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Server did not start.')), 5_000)),
  ]);
});

test.after(() => server?.kill());

test('does not expose dotfiles and returns no-store API configuration', async () => {
  const secret = await fetch(`http://127.0.0.1:${port}/.env`);
  assert.equal(secret.status, 404);

  const config = await fetch(`http://127.0.0.1:${port}/api/config`);
  assert.equal(config.status, 200);
  assert.equal(config.headers.get('cache-control'), 'no-store');
  const data = await config.json();
  assert.ok(data.firebase);
  assert.equal(Object.hasOwn(data.firebase, 'GEMINI_API_KEY'), false);
});

test('requires Firebase authentication before accepting assistant requests', async () => {
  const response = await fetch(`http://127.0.0.1:${port}/api/assistant`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ prompt: 'hello' }) });
  assert.equal(response.status, 401);
});

test('handles HEAD requests without a body', async () => {
  const response = await fetch(`http://127.0.0.1:${port}/`, { method: 'HEAD' });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
});
