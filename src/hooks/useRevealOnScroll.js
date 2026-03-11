import { useEffect } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/**
 * Reusable viewport reveal utility powered by IntersectionObserver.
 * Elements opt-in via the provided selector (default: [data-reveal]).
 */
export default function useRevealOnScroll({
  selector = "[data-reveal]",
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  stagger = 0.1,
  once = true,
  dependencyKey = ""
} = {}) {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const elements = Array.from(document.querySelectorAll(selector));
    if (!elements.length) return undefined;

    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    const markAsRevealed = (element) => {
      const revealOrder = toNumber(element.dataset.revealOrder, 0);
      const revealStagger = toNumber(element.dataset.revealStagger, stagger);
      const delay = Math.max(0, revealOrder * revealStagger);

      element.style.setProperty("--reveal-delay", `${delay}s`);
      element.style.willChange = "transform, opacity";
      element.classList.add("is-revealed");

      const clearWillChange = () => {
        element.style.willChange = "auto";
        element.removeEventListener("transitionend", clearWillChange);
      };

      element.addEventListener("transitionend", clearWillChange);
    };

    if (prefersReducedMotion) {
      elements.forEach((element) => {
        element.classList.add("is-revealed");
        element.style.willChange = "auto";
      });
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target;
          markAsRevealed(element);
          if (once) observer.unobserve(element);
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [selector, threshold, rootMargin, stagger, once, dependencyKey]);
}
