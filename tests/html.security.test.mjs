import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pages = ['index.html', 'programme.html', 'performers.html', 'info.html'];

const readPage = page => fs.readFileSync(path.join(root, 'web', page), 'utf8');

test('all pages define strict CSP and permissions policy', () => {
  pages.forEach(page => {
    const html = readPage(page);
    assert.match(html, /http-equiv="Content-Security-Policy"/, `${page} missing CSP`);
    assert.match(html, /http-equiv="Permissions-Policy"/, `${page} missing Permissions-Policy`);
    assert.match(html, /frame-ancestors 'none'/, `${page} CSP missing frame-ancestors`);
  });
});

test('all pages define canonical and robots metadata', () => {
  pages.forEach(page => {
    const html = readPage(page);
    assert.match(html, /<link rel="canonical" href="https:\/\/hostilian\.github\.io\/Desert_Pulse_Festival_complete\/.*">/, `${page} missing canonical`);
    assert.match(html, /<meta name="robots" content="index,follow,max-image-preview:large">/, `${page} missing robots`);
  });
});

test('all pages define social metadata fields', () => {
  pages.forEach(page => {
    const html = readPage(page);
    assert.match(html, /<meta property="og:title" content="[^"]+">/, `${page} missing og:title`);
    assert.match(html, /<meta property="og:description" content="[^"]+">/, `${page} missing og:description`);
    assert.match(html, /<meta property="og:image" content="https:\/\/hostilian\.github\.io\/Desert_Pulse_Festival_complete\/assets\/social\/[^"]+">/, `${page} missing og:image`);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image">/, `${page} missing twitter:card`);
    assert.match(html, /<meta name="twitter:image" content="https:\/\/hostilian\.github\.io\/Desert_Pulse_Festival_complete\/assets\/social\/[^"]+">/, `${page} missing twitter:image`);
  });
});

test('all pages define strict referrer, theme, and manifest metadata', () => {
  pages.forEach(page => {
    const html = readPage(page);
    assert.match(html, /<meta name="referrer" content="strict-origin-when-cross-origin">/, `${page} missing strict referrer policy`);
    assert.match(html, /<meta name="theme-color" content="#11162b">/, `${page} missing theme-color`);
    assert.match(html, /<link rel="manifest" href="site\.webmanifest">/, `${page} missing web manifest link`);
  });
});

test('all pages keep baseline document structure and seo metadata', () => {
  pages.forEach(page => {
    const html = readPage(page);
    assert.match(html, /^<!DOCTYPE html>/i, `${page} missing html doctype`);
    assert.match(html, /<html lang="en">/, `${page} missing lang attribute`);
    assert.match(html, /<title>[^<]+<\/title>/, `${page} missing title tag`);
    assert.match(html, /<meta name="description" content="[^"]+">/, `${page} missing meta description`);
  });
});
