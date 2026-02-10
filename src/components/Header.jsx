import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header className="site-menu">
    {/* LOGO -> torna alla home */}
    <Link to="/" className="logo">
      ROTARU BIANCA <br />
      <hr />
      <span className="logo-role">d e v e l o p e r</span>
    </Link>

    <nav className="nav-links">
      <a href="#about">About Me</a>
      <a href="#projects">Projects</a>
      <a href="#certifications">Certifications</a>
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
