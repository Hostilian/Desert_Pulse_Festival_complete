import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUrlFromParams, dayLabel, fmtTime, safe, storageGet, storageRemove, storageSet } from '../web/js/utils.js';

test('safe escapes critical HTML characters', () => {
  const escaped = safe('<x>"&</x>');
  assert.equal(escaped, '&lt;x&gt;&quot;&amp;&lt;/x&gt;');
});

test('dayLabel maps festival days to short labels', () => {
  assert.equal(dayLabel('2026-04-17T10:00:00'), 'Fri');
  assert.equal(dayLabel('2026-04-18T10:00:00'), 'Sat');
  assert.equal(dayLabel('2026-04-19T10:00:00'), 'Sun');
});

test('fmtTime returns fallback for invalid dates', () => {
  assert.equal(fmtTime('not-a-date'), '--:--');
});

test('storage helpers do not throw when localStorage is unavailable', () => {
  const original = globalThis.localStorage;
  globalThis.localStorage = {
    getItem() { throw new Error('blocked'); },
    setItem() { throw new Error('blocked'); },
    removeItem() { throw new Error('blocked'); }
  };
  assert.equal(storageGet('x'), null);
  assert.equal(storageSet('x', '1'), false);
  assert.equal(storageRemove('x'), false);
  globalThis.localStorage = original;
});

test('buildUrlFromParams trims values and removes empty entries', () => {
  const url = buildUrlFromParams('/programme.html', '?day=17&venue=v1', { venue: '  ', q: '  moon  ' });
  assert.equal(url, '/programme.html?day=17&q=moon');
});

test('buildUrlFromParams keeps zero-like values', () => {
  const url = buildUrlFromParams('/programme.html', '', { page: 0, includeHidden: false });
  assert.equal(url, '/programme.html?page=0&includeHidden=false');
});
