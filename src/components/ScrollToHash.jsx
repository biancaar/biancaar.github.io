import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return undefined;
    }

    const id = location.hash.replace("#", "");
    if (!id) return undefined;

    let rafId = 0;
    const timeoutIds = [];

    const getHeaderOffset = () =>
      window.matchMedia("(orientation: portrait)").matches ? 84 : 92;

    const scrollToHashTarget = (behavior = "auto") => {
      const el = document.getElementById(id);
      if (!el) return false;

      const top = Math.max(
        window.scrollY + el.getBoundingClientRect().top - getHeaderOffset(),
        0
      );

      window.scrollTo({ top, left: 0, behavior });
      return true;
    };

    let tries = 0;
    const maxTries = 180;

    const tick = () => {
      tries += 1;

      if (scrollToHashTarget("auto")) {
        // Reinforce after mount/layout refreshes (e.g. GSAP ScrollTrigger setup).
        timeoutIds.push(setTimeout(() => scrollToHashTarget("auto"), 120));
        timeoutIds.push(setTimeout(() => scrollToHashTarget("auto"), 420));
        return;
      }

      if (tries >= maxTries) return;
      rafId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [location.pathname, location.hash]);

  return null;
}
