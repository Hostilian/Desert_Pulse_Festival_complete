import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const webDir = path.join(root, 'web');

const read = relPath => fs.readFileSync(path.join(webDir, relPath), 'utf8');
const extractLdJson = html => {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  assert.ok(match, 'Missing JSON-LD script');
  return JSON.parse(match[1]);
};

test('home page contains valid Festival JSON-LD', () => {
  const ld = extractLdJson(read('index.html'));
  assert.equal(ld['@context'], 'https://schema.org');
  assert.equal(ld['@type'], 'Festival');
  assert.equal(ld.name, 'Desert Pulse Festival');
  assert.ok(String(ld.startDate).startsWith('2026-04-17'));
  assert.ok(String(ld.endDate).startsWith('2026-04-19'));
});

test('programme page contains MusicEvent array JSON-LD', () => {
  const ld = extractLdJson(read('programme.html'));
  assert.ok(Array.isArray(ld), 'Programme JSON-LD must be an array');
  assert.ok(ld.length > 0, 'Programme JSON-LD array is empty');
  ld.forEach(event => {
    assert.equal(event['@context'], 'https://schema.org');
    assert.equal(event['@type'], 'MusicEvent');
    assert.ok(event.name, 'MusicEvent missing name');
    assert.ok(event.startDate, 'MusicEvent missing startDate');
    assert.ok(event.endDate, 'MusicEvent missing endDate');
  });
});

test('performers page contains MusicFestival JSON-LD performer list', () => {
  const ld = extractLdJson(read('performers.html'));
  assert.equal(ld['@context'], 'https://schema.org');
  assert.equal(ld['@type'], 'MusicFestival');
  assert.ok(Array.isArray(ld.performer), 'performer list missing');
  assert.ok(ld.performer.length >= 3, 'performer list unexpectedly short');
});

test('info page contains WebPage JSON-LD with festival linkage', () => {
  const ld = extractLdJson(read('info.html'));
  assert.equal(ld['@context'], 'https://schema.org');
  assert.equal(ld['@type'], 'WebPage');
  assert.equal(ld.url, 'https://hostilian.github.io/Desert_Pulse_Festival_complete/info.html');
  assert.equal(ld.isPartOf?.name, 'Desert Pulse Festival');
});
