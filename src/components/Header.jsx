import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header className="site-menu">
    {/* LOGO -> torna alla home */}
    <Link to="/" className="logo">
      <img className="logo-mark" src="/LOGO.png" alt="Rotaru Bianca logo" />
      <div className="logo-text">
        
      </div>
    </Link>

    <nav className="nav-links">
      <Link to="/#about">About Me</Link>
      <Link to="/#timeline">Timeline</Link>
      <Link to="/#projects">Projects</Link>
    </nav>

    <div className="menu-right">
      <div className="language-selector">
        <button className="lang-btn">IT ▼</button>
        <ul className="lang-dropdown">
          <li data-lang="it">IT</li>
          <li data-lang="en">EN</li>
        </ul>
      </div>

      <a href="#contact" className="contact-btn">Contact Me</a>
    </div>
  </header>
);

export default Header;
