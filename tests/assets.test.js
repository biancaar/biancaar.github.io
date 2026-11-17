import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { projects } from '../src/data/projects.js';
import { creative } from '../src/data/creative.js';
import { column } from '../src/config/column.js';
import { site } from '../src/data/site.js';

test('all configured public media and available CV files exist', () => {
  const files = [column.model, column.fallback, site.existingPublicCv];
  for (const item of [...projects, ...creative]) {
    if (item.image) files.push(item.image);
    for (const image of [...(item.images || []), ...(item.gallery || [])]) files.push(image.src);
  }
  for (const locale of ['it', 'en']) if (site.cvReady[locale]) files.push(site.cv[locale]);
  for (const file of files) {
    assert.ok(file.startsWith('/'), `Expected root-relative public asset: ${file}`);
    assert.ok(fs.existsSync(`public${file}`), `Missing public asset: ${file}`);
  }
});
