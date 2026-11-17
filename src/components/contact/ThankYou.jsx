import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { site } from '../../data/site.js';
import Header from '../layout/Header.jsx';

const year = new Date().getFullYear();

/** Hash-based destination works on GitHub Pages, including direct reloads. */
export default function ThankYou({ t, lang, setLang }) {
  const title = useRef(null);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${t.thankTitle} — ${site.name}`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    title.current?.focus({ preventScroll: true });
    return () => { document.title = previousTitle; };
  }, [t.thankTitle]);
  return <div className="thank-page">
    <Header t={t} lang={lang} setLang={locale => { setLang(locale); window.location.hash = `thank-you/${locale}`; }} />
    <main className="thank-content">
      <span className="thank-symbol" aria-hidden="true"><Check size={28} strokeWidth={1.4} /></span>
      <p className="eyebrow">{t.thankEyebrow}</p>
      <h1 className="display-serif" ref={title} tabIndex={-1}>{t.thankTitle}<br /><em>{t.thankTitleAccent}</em></h1>
      <p className="thank-description">{t.thankDescription}</p>
      <a className="thank-back" href="#top"><ArrowLeft size={18} />{t.thankBack}</a>
      <a className="thank-projects" href="#work">{t.thankProjects}<ArrowUpRight size={17} /></a>
    </main>
    <footer className="thank-footer"><span>© {year} {site.name}</span><span>{t.footer}</span></footer>
  </div>;
}
