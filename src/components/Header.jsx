import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import mobileMenuIcon from "../assets/menu_40dp_FFFFFF_FILL0_wght400_GRAD0_opsz40 (1).png";
import mobileMenuCloseIcon from "../assets/close_40dp_FFFFFF_FILL0_wght400_GRAD0_opsz40.png";

const navItems = [
  { to: "/#about", label: "About Me" },
  { to: "/#timeline", label: "Timeline" },
  { to: "/#projects", label: "Projects" }
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
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
          <div className="language-selector">
            <button className="lang-btn">IT v</button>
            <ul className="lang-dropdown">
              <li data-lang="it">IT</li>
              <li data-lang="en">EN</li>
            </ul>
          </div>

          <a href="#contact" className="contact-btn">Contact Me</a>
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
            Contact Me
          </a>
        </nav>
      </div>
    </>
  );
};

export default Header;
