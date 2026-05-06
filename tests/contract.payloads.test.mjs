import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = process.cwd();
const schemaDir = path.join(root, 'data', 'API', 'json-schema');
const dataDir = path.join(root, 'data', 'API', 'json');

const validate = (schemaFile, dataFile) => {
  const ajv = new Ajv2020({ strict: false, allErrors: true, validateFormats: false });
  addFormats(ajv);
  const schema = JSON.parse(fs.readFileSync(path.join(schemaDir, schemaFile), 'utf8'));
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, dataFile), 'utf8'));
  const ok = ajv.validate(schema, data);
  assert.equal(ok, true, `${dataFile} invalid: ${ajv.errorsText()}`);
};

test('festival payload matches schema', () => validate('festival.schema.json', 'festival.json'));
test('venues payload matches schema', () => validate('venues.schema.json', 'venues.json'));
test('performers payload matches schema', () => validate('performers.schema.json', 'performers.json'));
test('events payload matches schema', () => validate('events.schema.json', 'events.json'));
test('venue detail payload matches schema', () => validate('venue-detail.schema.json', 'venue-v1.json'));
test('performer detail payload matches schema', () => validate('performer-detail.schema.json', 'performer-p1.json'));
test('event detail payload matches schema', () => validate('event-detail.schema.json', 'event-e1.json'));

test('list payload count does not undershoot items length', () => {
  ['venues.json', 'performers.json', 'events.json'].forEach(file => {
    const payload = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const count = Number(payload.count ?? 0);
    const itemsLength = Array.isArray(payload.items) ? payload.items.length : 0;
    assert.ok(count >= itemsLength, `${file} count (${count}) is lower than items length (${itemsLength})`);
  });
});

test('list payload ids are unique and non-empty', () => {
  ['venues.json', 'performers.json', 'events.json'].forEach(file => {
    const payload = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const items = Array.isArray(payload.items) ? payload.items : [];
    const ids = items.map(item => String(item?.id ?? '').trim());
    assert.equal(ids.every(id => id.length > 0), true, `${file} contains empty item ids`);
    assert.equal(new Set(ids).size, ids.length, `${file} contains duplicate item ids`);
  });
});

test('events have valid chronological start and end timestamps', () => {
  const payload = JSON.parse(fs.readFileSync(path.join(dataDir, 'events.json'), 'utf8'));
  const items = Array.isArray(payload.items) ? payload.items : [];
  items.forEach(event => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    assert.equal(Number.isNaN(start.getTime()), false, `event ${event.id} has invalid start timestamp`);
    assert.equal(Number.isNaN(end.getTime()), false, `event ${event.id} has invalid end timestamp`);
    assert.equal(end.getTime() > start.getTime(), true, `event ${event.id} has end <= start`);
  });
});

test('list payload pagination metadata is coherent', () => {
  ['venues.json', 'performers.json', 'events.json'].forEach(file => {
    const payload = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const items = Array.isArray(payload.items) ? payload.items : [];
    const count = Number(payload.count);
    assert.equal(Number.isInteger(count), true, `${file} count must be an integer`);
    assert.equal(count >= items.length, true, `${file} count cannot be lower than items.length`);

    if ('page' in payload) {
      const page = Number(payload.page);
      assert.equal(Number.isInteger(page), true, `${file} page must be an integer`);
      assert.equal(page >= 1, true, `${file} page must be >= 1`);
    }

    if ('pageSize' in payload) {
      const pageSize = Number(payload.pageSize);
      assert.equal(Number.isInteger(pageSize), true, `${file} pageSize must be an integer`);
      assert.equal(pageSize >= 1, true, `${file} pageSize must be >= 1`);
      assert.equal(items.length <= pageSize, true, `${file} items.length must be <= pageSize`);
    }
  });
});

test('entity ids follow stable typed prefixes', () => {
  const performers = JSON.parse(fs.readFileSync(path.join(dataDir, 'performers.json'), 'utf8'));
  const events = JSON.parse(fs.readFileSync(path.join(dataDir, 'events.json'), 'utf8'));
  const venues = JSON.parse(fs.readFileSync(path.join(dataDir, 'venues.json'), 'utf8'));

  (performers.items || []).forEach(item => assert.match(String(item.id), /^p\d+$/, `invalid performer id: ${item.id}`));
  (events.items || []).forEach(item => assert.match(String(item.id), /^e\d+$/, `invalid event id: ${item.id}`));
  (venues.items || []).forEach(item => assert.match(String(item.id), /^v\d+$/, `invalid venue id: ${item.id}`));
});
