import { test } from 'node:test';
import assert from 'node:assert/strict';
import { submitContact } from '../src/services/contact.js';

test('contact requests JSON and resolves only after the provider accepts the message', async () => {
  const data = new FormData();
  data.set('message', 'Test message');
  await submitContact('https://example.test/contact', data, async (endpoint, options) => {
    assert.equal(endpoint, 'https://example.test/contact');
    assert.equal(options.method, 'POST');
    assert.equal(options.body, data);
    assert.equal(options.headers.Accept, 'application/json');
    return { ok: true };
  });
});

test('provider errors and connection failures never count as a successful submission', async () => {
  for (const status of [400, 429, 500]) {
    await assert.rejects(submitContact('/contact', new FormData(), async () => ({ ok: false, status })));
  }
  await assert.rejects(submitContact('/contact', new FormData(), async () => { throw new TypeError('offline'); }));
});
