import React from "react";

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-inner">
      <div className="footer-left">
        <strong className="footer-name">Bianca Rotaru</strong>
        <span className="footer-role">Creative Developer · Web & 3D</span>
      </div>

      <nav className="footer-nav">
        <a href="#about">About Me</a>
        <a href="#projects">Projects</a>
        <a href="#certifications">Certifications</a>
      </nav>

      <div className="footer-right">
        <a href="https://www.linkedin.com/in/bianca-rotaru-920ba255" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href="/Bianca_Rotaru_CV.pdf" target="_blank" rel="noreferrer">
          CV
        </a>
      </div>
    </div>

    <div className="footer-bottom">
      © 2026 — All rights reserved
    </div>
  </footer>
);

export default Footer;
