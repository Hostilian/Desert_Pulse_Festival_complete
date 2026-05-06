import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const webDir = path.join(root, 'web');
const pages = ['index.html', 'programme.html', 'performers.html', 'info.html'];

const read = relPath => fs.readFileSync(path.join(webDir, relPath), 'utf8');

test('all pages include noscript fallback and module app entry', () => {
  pages.forEach(page => {
    const html = read(page);
    assert.match(html, /<noscript><p>[^<]+<\/p><\/noscript>/, `${page} missing noscript fallback`);
    assert.match(html, /<script type="module" src="app\.js"><\/script>/, `${page} missing module app entry`);
  });
});

test('home and detail pages keep critical API/data references visible', () => {
  const home = read('index.html');
  assert.match(home, /data\/API\/json\/festival\.json/, 'index.html missing festival endpoint reference');
  assert.match(home, /data\/openapi\.yaml/, 'index.html missing openapi reference');

  const programme = read('programme.html');
  assert.match(programme, /data\/API\/json\/events\.json/, 'programme.html missing events endpoint reference');

  const performers = read('performers.html');
  assert.match(performers, /data\/API\/json\/performers\.json/, 'performers.html missing performers endpoint reference');
  assert.match(performers, /data\/API\/json\/performer-p1\.json/, 'performers.html missing performer detail endpoint reference');
});
