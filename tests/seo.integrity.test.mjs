import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const webDir = path.join(root, 'web');
const baseUrl = 'https://hostilian.github.io/Desert_Pulse_Festival_complete';
const pages = ['index.html', 'programme.html', 'performers.html', 'info.html'];

const read = relPath => fs.readFileSync(path.join(webDir, relPath), 'utf8');

test('manifest start_url matches canonical site root', () => {
  const manifest = JSON.parse(read('site.webmanifest'));
  assert.equal(manifest.start_url, '/Desert_Pulse_Festival_complete/');
});

test('sitemap includes all public pages', () => {
  const sitemap = read('sitemap.xml');
  const requiredUrls = [
    `${baseUrl}/`,
    `${baseUrl}/programme.html`,
    `${baseUrl}/performers.html`,
    `${baseUrl}/info.html`
  ];
  requiredUrls.forEach(url => assert.equal(sitemap.includes(url), true, `Sitemap missing ${url}`));
});

test('page canonicals and og:url align with sitemap urls', () => {
  const expectedByPage = {
    'index.html': `${baseUrl}/`,
    'programme.html': `${baseUrl}/programme.html`,
    'performers.html': `${baseUrl}/performers.html`,
    'info.html': `${baseUrl}/info.html`
  };

  pages.forEach(page => {
    const html = read(page);
    const expected = expectedByPage[page];
    assert.equal(html.includes(`<link rel="canonical" href="${expected}"`), true, `${page} canonical mismatch`);
    assert.equal(html.includes(`<meta property="og:url" content="${expected}"`), true, `${page} og:url mismatch`);
  });
});

test('sitemap URLs are unique, absolute https, and fragment-free', () => {
  const sitemap = read('sitemap.xml');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].trim());
  assert.equal(urls.length > 0, true, 'sitemap has no <loc> entries');

  urls.forEach(url => {
    assert.equal(url.startsWith(`${baseUrl}/`), true, `sitemap URL must use base https url: ${url}`);
    assert.equal(url.includes('?'), false, `sitemap URL must not include query params: ${url}`);
    assert.equal(url.includes('#'), false, `sitemap URL must not include fragments: ${url}`);
  });

  assert.equal(new Set(urls).size, urls.length, 'sitemap contains duplicate URLs');
});
