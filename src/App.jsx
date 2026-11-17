import { useCallback, useEffect, useState } from 'react';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Hero from './components/sections/Hero.jsx';
import About from './components/sections/About.jsx';
import Journey from './components/sections/Journey.jsx';
import WorkGallery from './components/projects/WorkGallery.jsx';
import Creative from './components/sections/Creative.jsx';
import Contact from './components/sections/Contact.jsx';
import ProjectModal from './components/projects/ProjectModal.jsx';
import PageMotion from './components/motion/PageMotion.jsx';
import { copy } from './data/copy.js';
import ThankYou from './components/contact/ThankYou.jsx';

export default function App() {
  const [lang, setLang] = useState(() => window.location.hash === '#thank-you/en' ? 'en' : 'it');
  const [hash, setHash] = useState(() => window.location.hash);
  const [selected, setSelected] = useState(null);
  const t = copy[lang];
  const close = useCallback(() => setSelected(null), []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    const update = () => {
      setHash(window.location.hash);
      if (window.location.hash === '#thank-you/it') setLang('it');
      if (window.location.hash === '#thank-you/en') setLang('en');
    };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  // The portfolio remounts after the confirmation page; restore section anchors.
  useEffect(() => {
    if (hash.startsWith('#thank-you')) return;
    const frame = requestAnimationFrame(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash]);
  if (hash.startsWith('#thank-you')) return <ThankYou {...{ t, lang, setLang }} />;
  return <>
    <Header lang={lang} setLang={setLang} t={t} />
    <main>
      <Hero t={t} />
      <About t={t} lang={lang} />
      <Journey t={t} lang={lang} />
      <WorkGallery t={t} lang={lang} onOpen={setSelected} />
      <Creative t={t} lang={lang} />
      <Contact t={t} onSent={() => { window.location.hash = `thank-you/${lang}`; }} />
    </main>
    <Footer t={t} />
    <PageMotion lang={lang} />
    {selected && <ProjectModal project={selected} lang={lang} t={t} onClose={close} />}
  </>;
}
