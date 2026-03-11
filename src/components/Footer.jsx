import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import cvPdf from "../assets/CVRotaruBiancaAndreea_Public.pdf";
import { SITE_CONFIG } from "../config/site.config";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <strong className="footer-name">{SITE_CONFIG.ownerName}</strong>
          <span className="footer-role">{t("footer.role")}</span>
        </div>

        <nav className="footer-nav">
          <Link to="/#about">{t("nav.about")}</Link>
          <Link to="/#timeline">{t("nav.timeline")}</Link>
          <Link to="/#projects">{t("nav.projects")}</Link>
        </nav>

        <div className="footer-right">
          <a href={SITE_CONFIG.linkedInUrl} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={cvPdf} target="_blank" rel="noreferrer">
            CV
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        {t("footer.rights")}
      </div>
    </footer>
  );
};

export default Footer;
