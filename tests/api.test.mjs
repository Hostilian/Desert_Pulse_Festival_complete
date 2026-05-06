import test from 'node:test';
import assert from 'node:assert/strict';
import { json, jsonAllPages } from '../web/js/api.js';

test('json builds query string and returns parsed payload', async () => {
  const calls = [];
  globalThis.fetch = async url => {
    calls.push(url);
    return { ok: true, json: async () => ({ ok: true }) };
  };

  const payload = await json('events.json', { page: 2, pageSize: 20, q: '' });
  assert.deepEqual(payload, { ok: true });
  assert.equal(calls[0], 'data/API/json/events.json?page=2&pageSize=20');
});

test('json rejects non-ok responses with status', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 503 });
  await assert.rejects(() => json('events.json'), /Request failed: 503/);
});

test('json retries transient fetch errors', async () => {
  let attempts = 0;
  globalThis.fetch = async () => {
    attempts += 1;
    if (attempts < 3) throw new Error('temporary');
    return { ok: true, json: async () => ({ ok: true, attempts }) };
  };
  const payload = await json('events.json', {}, { retries: 3, retryDelayMs: 1 });
  assert.equal(payload.attempts, 3);
});

test('json aborts when timeout is hit', async () => {
  globalThis.fetch = (_url, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(signal.reason || new Error('aborted')), { once: true });
    setTimeout(() => resolve({ ok: true, json: async () => ({ ok: true }) }), 15);
  });
  await assert.rejects(() => json('events.json', {}, { timeoutMs: 1, retries: 0 }), /timeout|aborted/i);
});

test('json stops after retry budget is exhausted', async () => {
  let attempts = 0;
  globalThis.fetch = async () => {
    attempts += 1;
    throw new Error('still failing');
  };
  await assert.rejects(() => json('events.json', {}, { retries: 1, retryDelayMs: 1 }), /still failing/);
  assert.equal(attempts, 2);
});

test('json does not retry on non-retryable client errors', async () => {
  let attempts = 0;
  globalThis.fetch = async () => {
    attempts += 1;
    return { ok: false, status: 400 };
  };
  await assert.rejects(() => json('events.json', {}, { retries: 3, retryDelayMs: 1 }), /Request failed: 400/);
  assert.equal(attempts, 1);
});

test('json retries on 429 responses', async () => {
  let attempts = 0;
  globalThis.fetch = async () => {
    attempts += 1;
    if (attempts < 3) return { ok: false, status: 429 };
    return { ok: true, json: async () => ({ ok: true, attempts }) };
  };
  const payload = await json('events.json', {}, { retries: 3, retryDelayMs: 1 });
  assert.equal(payload.attempts, 3);
});

test('json rejects invalid retries option', async () => {
  await assert.rejects(() => json('events.json', {}, { retries: -1 }), /retries must be >= 0/);
  await assert.rejects(() => json('events.json', {}, { retries: 1.5 }), /retries must be an integer/);
});

test('json rejects invalid timeout and delay options', async () => {
  await assert.rejects(() => json('events.json', {}, { retryDelayMs: -1 }), /retryDelayMs must be >= 0/);
  await assert.rejects(() => json('events.json', {}, { timeoutMs: 0 }), /timeoutMs must be >= 1/);
});

test('jsonAllPages returns first payload when count/pageSize are invalid', async () => {
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ items: [{ id: 'p1' }], count: 'bad', pageSize: 1 }) });
  const payload = await jsonAllPages('performers.json');
  assert.deepEqual(payload.items, [{ id: 'p1' }]);
});

test('json surfaces invalid response payload parsing errors', async () => {
  let attempts = 0;
  globalThis.fetch = async () => {
    attempts += 1;
    return { ok: true, json: async () => { throw new Error('Unexpected token'); } };
  };
  await assert.rejects(() => json('events.json', {}, { retries: 0 }), /Invalid JSON payload/);
  assert.equal(attempts, 1);
});

test('jsonAllPages merges all paginated list items', async () => {
  const pages = new Map([
    ['data/API/json/performers.json', { items: [{ id: 'p1' }], count: 3, page: 1, pageSize: 1 }],
    ['data/API/json/performers.json?page=2&pageSize=1', { items: [{ id: 'p2' }], count: 3, page: 2, pageSize: 1 }],
    ['data/API/json/performers.json?page=3&pageSize=1', { items: [{ id: 'p3' }], count: 3, page: 3, pageSize: 1 }]
  ]);
  globalThis.fetch = async url => ({ ok: true, json: async () => pages.get(url) });

  const payload = await jsonAllPages('performers.json');
  assert.deepEqual(payload.items.map(item => item.id), ['p1', 'p2', 'p3']);
  assert.equal(payload.page, 1);
  assert.equal(payload.pageSize, 3);
});

test('jsonAllPages rejects excessive pagination fan-out', async () => {
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ items: [{ id: 'p1' }], count: 500, page: 1, pageSize: 1 }) });
  await assert.rejects(() => jsonAllPages('performers.json'), /Refusing to fetch 500 pages/);
});

test('jsonAllPages validates maxPages option', async () => {
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ items: [{ id: 'p1' }], count: 10, page: 1, pageSize: 1 }) });
  await assert.rejects(() => jsonAllPages('performers.json', {}, { maxPages: 0 }), /maxPages must be a positive integer/);
});
