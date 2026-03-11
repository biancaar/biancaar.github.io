import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import mobileMenuIcon from "../assets/menu_40dp_FFFFFF_FILL0_wght400_GRAD0_opsz40 (1).png";
import mobileMenuCloseIcon from "../assets/close_40dp_FFFFFF_FILL0_wght400_GRAD0_opsz40.png";
import languageArrowIcon from "../assets/arrow_drop_down_40dp_FFFFFF_FILL0_wght400_GRAD0_opsz40.png";
import { useLanguage } from "../contexts/LanguageContext";
import { subscribeMediaQueryChange } from "../utils/mediaQuery";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isHeaderCtaReady, setIsHeaderCtaReady] = useState(false);
  const selectorRef = useRef(null);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navItems = [
    { to: "/#about", label: t("nav.about") },
    { to: "/#timeline", label: t("nav.timeline") },
    { to: "/#projects", label: t("nav.projects") }
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsLangOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "";
      return undefined;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!selectorRef.current?.contains(event.target)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsHeaderCtaReady(true);
      return undefined;
    }

    const timer = window.setTimeout(() => setIsHeaderCtaReady(true), 150);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncUiPerformanceClass = () => {
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      const cores = navigator.hardwareConcurrency ?? 8;
      const memory = navigator.deviceMemory ?? 8;
      const reducedMotion = mediaQuery.matches;
      const lowPerformanceDevice = reducedMotion || (isPortrait && (cores <= 4 || memory <= 4));

      root.classList.toggle("is-low-performance-ui", lowPerformanceDevice);
    };

    syncUiPerformanceClass();
    window.addEventListener("resize", syncUiPerformanceClass);
    const unsubscribeMediaQuery = subscribeMediaQueryChange(
      mediaQuery,
      syncUiPerformanceClass
    );

    return () => {
      window.removeEventListener("resize", syncUiPerformanceClass);
      unsubscribeMediaQuery();
      root.classList.remove("is-low-performance-ui");
    };
  }, []);

  return (
    <>
      <header className="site-menu">
        <Link to="/" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
          <img className="logo-mark" src="/LOGO.png" alt="Rotaru Bianca logo" />
          <div className="logo-text" />
        </Link>

        <nav className="nav-links">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="menu-right">
          <div ref={selectorRef} className="language-selector">
            <button
              type="button"
              className="lang-btn"
              onClick={() => setIsLangOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={isLangOpen}
            >
              <span>{language.toUpperCase()}</span>
              <img src={languageArrowIcon} alt="" aria-hidden="true" className="lang-btn-icon" />
            </button>
            <ul className={`lang-dropdown ${isLangOpen ? "is-open" : ""}`} role="menu">
              <li role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={language === "it"}
                  className={language === "it" ? "is-active" : ""}
                  onClick={() => {
                    setLanguage("it");
                    setIsLangOpen(false);
                  }}
                >
                  IT
                </button>
              </li>
              <li role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={language === "en"}
                  className={language === "en" ? "is-active" : ""}
                  onClick={() => {
                    setLanguage("en");
                    setIsLangOpen(false);
                  }}
                >
                  EN
                </button>
              </li>
            </ul>
          </div>

          <a
            href="#contact"
            className={`contact-btn ${isHeaderCtaReady ? "is-ready" : ""}`}
          >
            {t("nav.contact")}
          </a>
        </div>

        <button
          type="button"
          className={`mobile-menu-toggle ${isMobileMenuOpen ? "is-open" : ""}`}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? (
            <img src={mobileMenuCloseIcon} alt="" aria-hidden="true" />
          ) : (
            <img src={mobileMenuIcon} alt="" aria-hidden="true" />
          )}
        </button>
      </header>

      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? "is-open" : ""}`}>
        <nav className="mobile-menu-nav">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setIsMobileMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <a href="/#contact" onClick={() => setIsMobileMenuOpen(false)}>
            {t("nav.contact")}
          </a>
          <div className="mobile-menu-language" role="group" aria-label="Language">
            <button
              type="button"
              className={language === "it" ? "is-active" : ""}
              onClick={() => setLanguage("it")}
            >
              IT
            </button>
            <button
              type="button"
              className={language === "en" ? "is-active" : ""}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
