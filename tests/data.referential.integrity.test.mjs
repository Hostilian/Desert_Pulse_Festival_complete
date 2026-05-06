import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'data', 'API', 'json');

const readJson = file => JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));

test('detail payload ids exist in corresponding list payloads', () => {
  const performers = readJson('performers.json');
  const events = readJson('events.json');
  const venues = readJson('venues.json');
  const performerDetail = readJson('performer-p1.json');
  const eventDetail = readJson('event-e1.json');
  const venueDetail = readJson('venue-v1.json');

  const performerIds = new Set((performers.items || []).map(item => item.id));
  const eventIds = new Set((events.items || []).map(item => item.id));
  const venueIds = new Set((venues.items || []).map(item => item.id));

  assert.equal(performerIds.has(performerDetail.id), true, 'performer detail id missing from performers list');
  assert.equal(eventIds.has(eventDetail.id), true, 'event detail id missing from events list');
  assert.equal(venueIds.has(venueDetail.id), true, 'venue detail id missing from venues list');
});

test('event references existing performer and venue ids', () => {
  const performers = readJson('performers.json');
  const events = readJson('events.json');
  const venues = readJson('venues.json');
  const performerIds = new Set((performers.items || []).map(item => item.id));
  const venueIds = new Set((venues.items || []).map(item => item.id));

  (events.items || []).forEach(event => {
    assert.equal(performerIds.has(event.performerId), true, `event ${event.id} has unknown performerId ${event.performerId}`);
    assert.equal(venueIds.has(event.venueId), true, `event ${event.id} has unknown venueId ${event.venueId}`);
  });
});

test('detail payload values remain aligned with corresponding list records', () => {
  const performers = readJson('performers.json');
  const events = readJson('events.json');
  const venues = readJson('venues.json');
  const performerDetail = readJson('performer-p1.json');
  const eventDetail = readJson('event-e1.json');
  const venueDetail = readJson('venue-v1.json');

  const performerListItem = (performers.items || []).find(item => item.id === performerDetail.id);
  const eventListItem = (events.items || []).find(item => item.id === eventDetail.id);
  const venueListItem = (venues.items || []).find(item => item.id === venueDetail.id);

  assert.ok(performerListItem, `Missing performer list item for ${performerDetail.id}`);
  assert.ok(eventListItem, `Missing event list item for ${eventDetail.id}`);
  assert.ok(venueListItem, `Missing venue list item for ${venueDetail.id}`);

  assert.deepEqual(performerDetail, performerListItem, 'performer detail payload drifted from list payload');
  assert.deepEqual(eventDetail, eventListItem, 'event detail payload drifted from list payload');
  assert.deepEqual(venueDetail, venueListItem, 'venue detail payload drifted from list payload');
});
