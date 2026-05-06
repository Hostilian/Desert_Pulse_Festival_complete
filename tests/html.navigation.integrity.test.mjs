import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const webDir = path.join(root, 'web');
const pages = [
  { file: 'index.html', currentHref: 'index.html' },
  { file: 'programme.html', currentHref: 'programme.html' },
  { file: 'performers.html', currentHref: 'performers.html' },
  { file: 'info.html', currentHref: 'info.html' }
];

const readPage = file => fs.readFileSync(path.join(webDir, file), 'utf8');

test('each page has one primary navigation current marker', () => {
  pages.forEach(({ file, currentHref }) => {
    const html = readPage(file);
    const currentMatches = [...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*aria-current="page"[^>]*>/g)];
    assert.equal(currentMatches.length, 1, `${file} should have exactly one aria-current nav item`);
    assert.equal(currentMatches[0][1], currentHref, `${file} has incorrect current nav href`);
  });
});

test('each page skip link points to existing content landmark', () => {
  pages.forEach(({ file }) => {
    const html = readPage(file);
    assert.match(html, /<a[^>]*class="skip-link"[^>]*href="#content"[^>]*>/, `${file} missing skip link to #content`);
    assert.match(html, /<main[^>]*id="content"[^>]*>/, `${file} missing #content main landmark`);
  });
});

test('each page includes exactly one top-level h1 heading', () => {
  pages.forEach(({ file }) => {
    const html = readPage(file);
    const h1Count = (html.match(/<h1\b/g) || []).length;
    assert.equal(h1Count, 1, `${file} should include exactly one h1`);
  });
});
