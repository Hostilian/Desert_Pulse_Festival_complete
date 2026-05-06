import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const webDir = path.join(root, 'web');
const pages = ['index.html', 'programme.html', 'performers.html', 'info.html'];

const read = relPath => fs.readFileSync(path.join(webDir, relPath), 'utf8');
const exists = relPath => fs.existsSync(path.join(webDir, relPath));

test('manifest icon assets exist on disk', () => {
  const manifest = JSON.parse(read('site.webmanifest'));
  const iconSources = (manifest.icons || []).map(icon => String(icon.src || ''));
  assert.ok(iconSources.length > 0, 'Manifest defines no icons');
  iconSources.forEach(src => assert.equal(exists(src), true, `Missing manifest icon: ${src}`));
});

test('all page social image references point to existing social assets', () => {
  pages.forEach(page => {
    const html = read(page);
    const matches = [...html.matchAll(/assets\/social\/([a-z0-9-]+\.svg)/gi)].map(match => match[1]);
    assert.ok(matches.length > 0, `${page} has no social image references`);
    matches.forEach(file => assert.equal(exists(`assets/social/${file}`), true, `${page} references missing social asset ${file}`));
  });
});
