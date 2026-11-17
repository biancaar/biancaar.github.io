import { useLayoutEffect, useRef, useState } from 'react';
import useMediaQuery from './useMediaQuery.js';
import { getScrollProgress, HORIZONTAL_SCENE_QUERY } from '../config/responsive.js';

/**
 * Shared native sticky scene. No pin spacers, transformed page wrappers,
 * body-height writes or GSAP refreshes can alter another section's boundaries.
 */
export default function useHorizontalScene(itemCount, contentKey) {
  const horizontal = useMediaQuery(HORIZONTAL_SCENE_QUERY);
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  useLayoutEffect(() => {
    if (!horizontal) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    const runtime = { distance: 0, frame: 0, previousIndex: -1, disposed: false };
    const update = () => {
      runtime.frame = 0;
      const progress = getScrollProgress(0, section.getBoundingClientRect().top, runtime.distance);
      track.style.transform = `translate3d(${-progress * runtime.distance}px, 0, 0)`;
      section.style.setProperty('--scene-progress', progress);
      const next = Math.round(progress * (itemCount - 1));
      if (next !== runtime.previousIndex) { runtime.previousIndex = next; setIndex(next); }
    };
    const schedule = () => { if (!runtime.frame) runtime.frame = requestAnimationFrame(update); };
    const measure = () => {
      if (runtime.disposed) return;
      runtime.distance = Math.max(0, track.scrollWidth - stage.clientWidth);
      section.style.setProperty('--scene-distance', `${runtime.distance}px`);
      schedule();
    };
    // Observe intrinsic content, not the outer section whose height we change.
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(stage);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    document.fonts.ready.then(measure);
    measure();
    return () => {
      runtime.disposed = true;
      observer.disconnect();
      cancelAnimationFrame(runtime.frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      section.style.removeProperty('--scene-distance');
      section.style.removeProperty('--scene-progress');
      track.style.removeProperty('transform');
    };
  }, [horizontal, itemCount, contentKey]);
  return { horizontal, sectionRef, stageRef, trackRef, index };
}
