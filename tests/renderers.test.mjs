import test from 'node:test';
import assert from 'node:assert/strict';
import { renderEventCard, renderVenueCard } from '../web/js/renderers.js';

test('renderVenueCard shows n/a when capacity is invalid', () => {
  const html = renderVenueCard({ id: 'v1', capacity: -3, name: 'North', description: 'desc', area: 'A1' });
  assert.equal(html.includes('cap. n/a'), true);
});

test('renderEventCard tolerates invalid time values', () => {
  const html = renderEventCard(
    { type: 'talk', title: 'Session', start: 'bad-date', end: 'also-bad', venueId: 'v1' },
    { genre: 'Indie', name: 'Performer' },
    { name: 'Venue' }
  );
  assert.equal(html.includes('--:--'), true);
});
