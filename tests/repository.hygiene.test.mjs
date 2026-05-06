import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const gitignorePath = path.join(root, '.gitignore');

test('.gitignore includes core sensitive/build patterns', () => {
  const content = fs.readFileSync(gitignorePath, 'utf8');
  const lines = new Set(content.split(/\r?\n/).map(line => line.trim()).filter(Boolean));
  ['node_modules/', 'dist/', '.env', '.env.*', '*.log'].forEach(pattern => {
    assert.equal(lines.has(pattern), true, `Missing ${pattern}`);
  });
});
