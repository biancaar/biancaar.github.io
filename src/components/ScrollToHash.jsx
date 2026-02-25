import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const id = location.hash.replace("#", "");
    if (!id) return;

    const scroll = () => {
      const el = document.getElementById(id);
      if (!el) return false;

      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    };

    // 1) prova subito
    if (scroll()) return;

    // 2) se la pagina/section non è ancora montata, riprova per un attimo
    let tries = 0;
    const maxTries = 20; // ~ 20 frame
    const tick = () => {
      tries += 1;
      if (scroll() || tries >= maxTries) return;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [location.pathname, location.hash]);

  return null;
}
