import test from 'node:test';
import assert from 'node:assert/strict';
import { filterEvents, normalizeProgrammePayload } from '../web/js/pages/programme.js';

const events = [
  { id: 'e1', performerId: 'p1', venueId: 'v1', title: 'Alpha Night', start: '2026-04-17T18:00:00' },
  { id: 'e2', performerId: 'p2', venueId: 'v2', title: 'Beta Dawn', start: '2026-04-18T12:00:00' },
  { id: 'e3', performerId: 'p1', venueId: 'v1', title: 'Gamma Noon', start: '2026-04-17T10:00:00' }
];
const performerMap = { p1: { name: 'Lunar Waves' }, p2: { name: 'Neon Horizon' } };

test('filterEvents applies day and sorting', () => {
  const result = filterEvents(events, performerMap, { day: '17', venue: '', q: '' });
  assert.deepEqual(result.map(row => row.id), ['e3', 'e1']);
});

test('filterEvents applies venue and query', () => {
  const result = filterEvents(events, performerMap, { day: '17', venue: 'v1', q: 'lunar' });
  assert.deepEqual(result.map(row => row.id), ['e3', 'e1']);
});

test('normalizeProgrammePayload filters malformed events', () => {
  const payload = normalizeProgrammePayload({
    events: { items: [{ id: 'e1', title: 'Valid', start: '2026-04-17T10:00:00' }, { id: '', title: 'Bad', start: 'x' }] },
    performers: { items: [{ id: 'p1', name: 'Lunar' }] },
    venues: { items: [{ id: 'v1', name: 'Solar' }] }
  });
  assert.deepEqual(payload.eventItems.map(item => item.id), ['e1']);
});
