import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HORIZONTAL_SCENE_QUERY } from '../../config/responsive.js';
import useMediaQuery from '../../hooks/useMediaQuery.js';

gsap.registerPlugin(ScrollTrigger);

/** Decorative motion only. Document scrolling and sticky positioning stay native. */
export default function PageMotion({ lang }) {
  const horizontal = useMediaQuery(HORIZONTAL_SCENE_QUERY);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero-name span', { yPercent: 105, autoAlpha: 0, stagger: .13, duration: 1.3, ease: 'power3.out' });
      gsap.from('.hero-claim, .hero-description, .hero-actions', { y: 25, autoAlpha: 0, stagger: .12, duration: 1, delay: .35 });
      gsap.to('.hero-name', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 1 } });
      ['.about-title', '.about-narrative p', '.skill-row', '.creative-card', '.contact-copy', '.contact-options'].forEach(selector => {
        gsap.utils.toArray(selector).forEach(element => gsap.from(element, {
          y: 35, autoAlpha: 0, duration: .8, ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 95%', once: true },
        }));
      });
      if (!horizontal) {
        gsap.fromTo('.is-vertical .journey-line-fill', { scaleY: 0 }, {
          scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: '.journey-section .journey-track', start: 'top 70%', end: 'bottom 65%', scrub: true },
        });
      }
    });
    return () => media.revert();
  }, [lang, horizontal]);
  return null;
}
