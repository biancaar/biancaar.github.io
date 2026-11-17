import { ArrowUp } from 'lucide-react';
import { site } from '../../data/site.js';

const year = new Date().getFullYear();

export default function Footer({ t }) {
  return <footer className="site-footer">
    <span>© {year} {site.name}</span>
    <span>{t.footer}</span>
    <a href="#top">{t.backToTop}<ArrowUp size={13} /></a>
  </footer>;
}
