import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { copy } from '../src/data/copy.js';
import { projects } from '../src/data/projects.js';
import { timeline } from '../src/data/timeline.js';

function sourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(file) : file.endsWith('.jsx') ? [file] : [];
  });
}

test('all component text keys exist in English and Italian', () => {
  const keys = new Set(sourceFiles('src/components').flatMap(file =>
    [...fs.readFileSync(file, 'utf8').matchAll(/\bt\.([A-Za-z]\w*)/g)].map(match => match[1]),
  ));
  for (const key of keys) for (const lang of ['en', 'it']) {
    assert.ok(copy[lang][key] !== undefined, `${lang}.${key} is missing`);
  }
});

test('project identifiers are unique and localized cards are complete', () => {
  assert.equal(new Set(projects.map(project => project.id)).size, projects.length);
  for (const project of projects) for (const lang of ['en', 'it']) {
    for (const field of ['title', 'category', 'subtitle', 'summary', 'details']) {
      assert.ok(project[field][lang], `${project.id}.${field}.${lang} is missing`);
    }
  }
  for (const stage of timeline) for (const lang of ['en', 'it']) {
    assert.ok(stage.title[lang] && stage.text[lang]);
  }
});
