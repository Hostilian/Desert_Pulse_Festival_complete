import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const root = process.cwd();
const specPath = path.join(root, 'data', 'openapi.yaml');
const spec = YAML.parse(fs.readFileSync(specPath, 'utf8'));

test('openapi has secure server url', () => {
  const urls = (spec.servers || []).map(server => String(server.url || ''));
  assert.ok(urls.every(url => url.startsWith('https://')), 'All servers must use https');
});

test('openapi includes detail endpoints for each entity', () => {
  const detailEndpoints = [
    '/data/API/json/venue-{id}.json',
    '/data/API/json/performer-{id}.json',
    '/data/API/json/event-{id}.json'
  ];
  detailEndpoints.forEach(endpoint => assert.ok(spec.paths?.[endpoint], `Missing ${endpoint}`));
});

test('openapi query params avoid unknown names', () => {
  const eventsParams = spec.paths?.['/data/API/json/events.json']?.get?.parameters || [];
  const names = new Set(eventsParams.map(param => param.name));
  ['day', 'venueId', 'performerId', 'page', 'pageSize'].forEach(name => assert.ok(names.has(name), `Missing ${name}`));
});

test('openapi path operations include 200 json responses', () => {
  Object.entries(spec.paths || {}).forEach(([pathName, methods]) => {
    const getMethod = methods?.get;
    assert.ok(getMethod, `Missing GET operation for ${pathName}`);
    const response = getMethod.responses?.['200'];
    assert.ok(response, `Missing 200 response for ${pathName}`);
    const hasJsonSchema = Boolean(response.content?.['application/json']?.schema);
    assert.equal(hasJsonSchema, true, `Missing application/json schema for ${pathName}`);
  });
});
