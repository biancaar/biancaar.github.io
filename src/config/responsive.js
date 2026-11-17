// Match the desktop scene query in styles/scroll-scenes.css.
export const HORIZONTAL_SCENE_QUERY = '(min-width: 1100px) and (min-height: 650px) and (min-aspect-ratio: 1/1) and (prefers-reduced-motion: no-preference)';

export function getScrollProgress(scrollY, start, distance) {
  return distance > 0 ? Math.min(1, Math.max(0, (scrollY - start) / distance)) : 0;
}
