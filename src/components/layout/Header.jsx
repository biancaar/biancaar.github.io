import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export default function Header({ lang, setLang, t }) {
  const [open, setOpen] = useState(false);
  const items = ['about', 'journey', 'work', 'contact'].map((id, i) => ({ id, label: t.nav[i] }));
  useEffect(() => {
    const onKey = event => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return <>
    <header className="site-header">
      <a href="#top" className="logo" aria-label="Bianca Rotaru - home">BR<span>.</span></a>
      <nav className="desktop-nav" aria-label={t.menu}>
        {items.map(item => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}
      </nav>
      <div className="header-right">
        <button className="language-toggle" onClick={() => setLang(lang === 'en' ? 'it' : 'en')} aria-label={lang === 'en' ? "Passa all'italiano" : 'Switch to English'}>
          {lang.toUpperCase()}<span>/ {lang === 'en' ? 'IT' : 'EN'}</span>
        </button>
        <button className="menu-toggle" aria-label={open ? t.close : t.menu} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(value => !value)}>
          {open ? <X size={21} /> : <Menu size={21} />}<span>{open ? t.close : t.menu}</span>
        </button>
      </div>
    </header>
    {open && <nav id="mobile-navigation" className="mobile-navigation open" aria-label={t.menu}>
      {items.map((item, i) => <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)}>
        <small>0{i + 1}</small>{item.label}<ArrowUpRight size={21} />
      </a>)}
    </nav>}
  </>;
}
