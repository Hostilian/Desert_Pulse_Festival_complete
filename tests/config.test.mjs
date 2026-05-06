import test from 'node:test';
import assert from 'node:assert/strict';
import { DATA_ROOT, DAYS, PACK_CHECKLIST_VERSION } from '../web/js/config.js';

test('core config values remain stable', () => {
  assert.equal(DATA_ROOT, 'data/API/json/');
  assert.deepEqual(DAYS, ['17', '18', '19']);
  assert.match(PACK_CHECKLIST_VERSION, /^v\d+$/);
});
