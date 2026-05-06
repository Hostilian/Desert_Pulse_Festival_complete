import test from 'node:test';
import assert from 'node:assert/strict';
import { filterPerformers, normalizePerformersPayload } from '../web/js/pages/performers.js';

const performers = [
  { id: 'p1', genre: 'Electronic', name: 'Lunar Waves', country: 'USA' },
  { id: 'p2', genre: 'Indie', name: 'Neon Horizon', country: 'UK' },
  { id: 'p3', genre: 'Electronic', name: 'Solar Tide', country: 'Canada' }
];

test('filterPerformers applies genre filter', () => {
  const result = filterPerformers(performers, { genre: 'Electronic', q: '' });
  assert.deepEqual(result.map(row => row.id), ['p1', 'p3']);
});

test('filterPerformers applies query on name and country', () => {
  const byName = filterPerformers(performers, { genre: '', q: 'neon' });
  assert.deepEqual(byName.map(row => row.id), ['p2']);
  const byCountry = filterPerformers(performers, { genre: '', q: 'can' });
  assert.deepEqual(byCountry.map(row => row.id), ['p3']);
});

test('normalizePerformersPayload filters malformed entries', () => {
  const items = normalizePerformersPayload({
    items: [{ id: 'p1', name: 'Valid' }, { id: '', name: 'Invalid' }, { id: 'p2', name: '' }]
  });
  assert.deepEqual(items.map(item => item.id), ['p1']);
});
