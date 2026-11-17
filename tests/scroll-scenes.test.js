import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getScrollProgress, HORIZONTAL_SCENE_QUERY } from '../src/config/responsive.js';

test('scene progress is bounded, including a stage with no overflow', () => {
  assert.equal(getScrollProgress(90, 100, 400), 0);
  assert.equal(getScrollProgress(300, 100, 400), .5);
  assert.equal(getScrollProgress(600, 100, 400), 1);
  assert.equal(getScrollProgress(100, 100, 0), 0);
});

for (const [width, height] of [[1887,1126],[1920,1080],[1440,900],[1366,768],[1280,720],[2560,1440]]) {
  test(`all four project panels finish before leaving the stage at ${width}×${height}`, () => {
    const distance = width * 3; // Four project panels, with no introductory slide.
    const start = 5000;
    const end = start + distance;
    assert.equal(getScrollProgress(end, start, distance) * distance, distance);
    // At the end, the final panel fills exactly one viewport; no blank runway.
    const lastPanelLeft = width * 3 - getScrollProgress(end, start, distance) * distance;
    assert.equal(lastPanelLeft, 0);
    const nextSectionTop = start + distance + height;
    assert.equal(nextSectionTop - end, height);
    assert.ok(getScrollProgress(start + distance / 3, start, distance) < 1);
  });
}

test('horizontal mode explicitly excludes portrait, small and short viewports', () => {
  assert.match(HORIZONTAL_SCENE_QUERY, /min-width: 1100px/);
  assert.match(HORIZONTAL_SCENE_QUERY, /min-height: 650px/);
  assert.match(HORIZONTAL_SCENE_QUERY, /min-aspect-ratio: 1\/1/);
  assert.match(HORIZONTAL_SCENE_QUERY, /prefers-reduced-motion: no-preference/);
  const css = fs.readFileSync(new URL('../src/styles/scroll-scenes.css', import.meta.url), 'utf8');
  assert.ok(css.includes('(min-width: 1100px) and (min-height: 650px) and (min-aspect-ratio: 1/1)'));
});

test('scroll controller has no competing pinning, body-height writes or refresh observer', () => {
  const motion = fs.readFileSync(new URL('../src/components/motion/PageMotion.jsx', import.meta.url), 'utf8');
  const hook = fs.readFileSync(new URL('../src/hooks/useHorizontalScene.js', import.meta.url), 'utf8');
  assert.doesNotMatch(motion, /ScrollSmoother|pin:\s*true|ResizeObserver/);
  assert.doesNotMatch(hook, /body\.style|ScrollTrigger\.refresh/);
});
