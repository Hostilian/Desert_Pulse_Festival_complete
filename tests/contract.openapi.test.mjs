import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const root = process.cwd();
const specPath = path.join(root, 'data', 'openapi.yaml');
const specText = fs.readFileSync(specPath, 'utf8');
const spec = YAML.parse(specText);

test('openapi lists static JSON endpoints used by frontend', () => {
  const required = [
    '/data/API/json/festival.json',
    '/data/API/json/venues.json',
    '/data/API/json/performers.json',
    '/data/API/json/events.json'
  ];
  required.forEach(endpoint => assert.ok(spec.paths?.[endpoint], `Missing endpoint ${endpoint}`));
});

test('openapi schema references exist', () => {
  const refs = [...specText.matchAll(/\$ref:\s*'([^']+)'/g)].map(match => match[1]);
  assert.ok(refs.length > 0, 'No schema references discovered');
  refs.forEach(ref => {
    const schemaPath = path.join(root, 'data', ref.replace('./', ''));
    assert.equal(fs.existsSync(schemaPath), true, `Missing schema ref target: ${ref}`);
  });
});

test('openapi does not expose insecure transport', () => {
  const raw = specText.toLowerCase();
  assert.equal(raw.includes('http://'), false, 'OpenAPI contains insecure http:// reference');
});
