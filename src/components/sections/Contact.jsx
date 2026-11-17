import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Download, CodeXml, BriefcaseBusiness, Mail } from 'lucide-react';
import Label from '../ui/Label.jsx';
import { site } from '../../data/site.js';
import ContactForm from '../contact/ContactForm.jsx';

function ContactOption({ href, icon: Icon, children, external = true }) {
  return <a className="contact-option" href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
    <span><Icon size={20} />{children}</span><ArrowUpRight size={21} />
  </a>;
}

function ResumeLinks({ t }) {
  const locales = ['en', 'it'].filter(locale => site.cvReady[locale]);
  return <div className="cv-links">
    <span className="contact-mini">{t.publicResume}</span>
    {locales.map(locale => <a key={locale} href={site.cv[locale]} download className="cv-button">{locale === 'en' ? t.cvEn : t.cvIt}<Download size={15} /></a>)}
    {!locales.length && <a className="cv-button" href={site.existingPublicCv} target="_blank" rel="noopener noreferrer">{t.cvSoon}<ArrowUpRight size={15} /></a>}
  </div>;
}

export default function Contact({ t, onSent }) {
  const [formOpen, setFormOpen] = useState(false);
  return <section className="contact-section full-screen" id="contact">
    <div className="section-padding contact-layout">
      <div className="contact-copy">
        <Label light>{t.contactEyebrow}</Label><h2 className="display-serif contact-title">{t.contactTitle}</h2>
        <p>{t.contactLead}</p><span className="availability"><i />{t.contactAvailable}</span>
      </div>
      <div className="contact-options">
        <div className="contact-top">{t.waysToConnect}<ArrowUpRight size={18} /></div>
        {site.publicEmail && <ContactOption href={`mailto:${site.publicEmail}`} icon={Mail} external={false}>{t.contactEmail}</ContactOption>}
        <ContactOption href={site.linkedin} icon={BriefcaseBusiness}>LinkedIn</ContactOption>
        <ContactOption href={site.github} icon={CodeXml}>GitHub</ContactOption>
        <ResumeLinks t={t} />
        <button className="contact-form-toggle" onClick={() => setFormOpen(value => !value)} aria-expanded={formOpen}>
          {t.formPrompt}<strong>{formOpen ? t.close : t.formShow}</strong><ArrowRight size={17} />
        </button>
        {formOpen && <ContactForm t={t} onSent={onSent} />}
      </div>
    </div>
  </section>;
}
