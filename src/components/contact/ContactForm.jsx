import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { site } from '../../data/site.js';
import { submitContact } from '../../services/contact.js';

export default function ContactForm({ t, onSent }) {
  const [status, setStatus] = useState('idle');
  const sending = useRef(false);
  async function handleSubmit(event) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    sending.current = true;
    setStatus('sending');
    try {
      await submitContact(site.contactFormAction, data);
      form.reset();
      onSent();
    } catch {
      // Keep the visitor's message intact for another attempt.
      setStatus('error');
    } finally {
      sending.current = false;
    }
  }
  return <form className="contact-form" action={site.contactFormAction} method="POST" onSubmit={handleSubmit} aria-busy={status === 'sending'}>
    <fieldset disabled={status === 'sending'}>
      <label>{t.formName}<input name="name" autoComplete="name" required maxLength={100} /></label>
      <label>{t.formEmail}<input name="email" type="email" autoComplete="email" required maxLength={180} /></label>
      <label>{t.formMessage}<textarea name="message" rows={4} required minLength={5} maxLength={5000} /></label>
      <input type="hidden" name="_subject" value={`Portfolio ${site.name} - contact`} />
      <button className="form-submit" type="submit">{status === 'sending' ? t.formSending : t.formSend}<ArrowUpRight size={17} /></button>
    </fieldset>
    <p className="contact-form-status" role="status" aria-live="polite">{status === 'sending' ? t.formSending : status === 'error' ? t.formError : ''}</p>
    <small>{t.formProvider}</small>
  </form>;
}
