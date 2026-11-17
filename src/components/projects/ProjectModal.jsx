import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import ArrowLink from '../ui/ArrowLink.jsx';
import ProjectVisual, { ProjectImage } from './ProjectVisual.jsx';

export default function ProjectModal({ project, lang, t, onClose }) {
  const dialog = useRef(null);
  const closeButton = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    document.body.classList.add('modal-open');
    closeButton.current?.focus({ preventScroll: true });
    const onKey = event => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const focusable = dialog.current?.querySelectorAll('button:not(:disabled), a[href]');
      if (!focusable?.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKey);
      previous?.focus?.({ preventScroll: true });
    };
  }, [onClose]);
  return <div className="project-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialog} className="project-dialog" role="dialog" aria-modal="true" aria-label={project.title[lang]}>
      <button ref={closeButton} className="project-close" onClick={onClose}>{t.back}<X size={20} /></button>
      <div className="project-dialog-content">
        <span className="eyebrow eyebrow-rust">{project.number} / {project.category[lang]}</span>
        <h2 className="display-serif">{project.title[lang]}</h2><p className="dialog-lead">{project.subtitle[lang]}</p>
        <ProjectVisual project={project} small lang={lang} />
        {project.details[lang].split(/\n\s*\n/).map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        {project.gallery?.length > 0 && <div className="project-detail-gallery">
          {project.gallery.map(image => <figure key={image.src}>
            <div className="project-detail-image" style={image.aspectRatio ? { aspectRatio: image.aspectRatio } : undefined}>
              <ProjectImage src={image.src} alt={image.alt?.[lang] || project.title[lang]} position={image.position || 'center'} />
            </div>
            {image.caption?.[lang] && <figcaption>{image.caption[lang]}</figcaption>}
          </figure>)}
        </div>}
        <div className="work-tags modal-tags">{project.stack.map(item => <span key={item}>{item}</span>)}</div>
        <div className="dialog-links">
          {project.demo && <ArrowLink href={project.demo} external>{t.demo}</ArrowLink>}
          {project.repository && <ArrowLink href={project.repository} external>{t.source}</ArrowLink>}
        </div>
      </div>
    </section>
  </div>;
}
