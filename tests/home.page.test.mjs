import test from 'node:test';
import assert from 'node:assert/strict';
import { FEATURED_PERFORMERS_LIMIT } from '../web/js/config.js';
import { normalizeHomePayload } from '../web/js/pages/home.js';

test('featured performers limit remains bounded for home page rendering', () => {
  assert.equal(FEATURED_PERFORMERS_LIMIT, 6);
  assert.ok(FEATURED_PERFORMERS_LIMIT > 0);
  assert.ok(FEATURED_PERFORMERS_LIMIT <= 12);
});

test('normalizeHomePayload sanitizes malformed dataset shapes', () => {
  const payload = normalizeHomePayload({
    performers: { items: [{ id: 'p1', name: 'Lunar', genre: 'Electronic' }, { id: '', name: 'Bad' }], count: 'x' },
    events: { items: [{ id: 'e1' }] },
    venues: {}
  });
  assert.equal(payload.performers.items.length, 1);
  assert.equal(payload.performers.count, 1);
  assert.equal(payload.events.count, 1);
  assert.equal(payload.venues.count, 0);
});
