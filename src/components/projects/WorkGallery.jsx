import { useCallback, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { projects } from '../../data/projects.js';
import useHorizontalScene from '../../hooks/useHorizontalScene.js';
import ProjectVisual from './ProjectVisual.jsx';

const count = projects.length;
const padded = number => String(number).padStart(2, '0');

function ProjectSlide({ project, lang, t, onOpen, horizontal }) {
  return <article className={`work-slide ${project.featured ? 'is-featured' : 'is-secondary'}`}>
    <div className="work-slide-layout">
      <div className="work-slide-copy">
        <div className="work-slide-number">{project.number}<span>/ {padded(count)}</span><i />{project.category[lang]}</div>
        <h3 className="work-slide-title display-serif">{project.title[lang]}</h3>
        <p className="work-slide-summary">{project.summary[lang]}</p>
        <div className="work-tags">{project.stack.map(skill => <span key={skill}>{skill}</span>)}</div>
        <button className="underlined-button on-dark" onClick={() => onOpen(project)}>{t.viewCase}<ArrowUpRight size={19} /></button>
      </div>
      <div className="work-slide-media"><ProjectVisual project={project} lang={lang} /></div>
    </div>
    {horizontal && <span className="work-slide-index">{project.number}</span>}
  </article>;
}

export default function WorkGallery({ lang, t, onOpen }) {
  const { horizontal, sectionRef, stageRef, trackRef, index } = useHorizontalScene(count, lang);
  const mobileList = useRef(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const onMobileScroll = useCallback(() => {
    const list = mobileList.current;
    if (!list?.firstElementChild) return;
    const slides = [...list.children];
    const offset = list.getBoundingClientRect().left + 24;
    const nearest = slides.reduce((best, slide, i) => Math.abs(slide.getBoundingClientRect().left - offset) < Math.abs(slides[best].getBoundingClientRect().left - offset) ? i : best, 0);
    setMobileIndex(nearest);
  }, []);
  const goTo = position => {
    const list = mobileList.current;
    const slide = list?.children[position];
    if (slide) list.scrollTo({ left: list.scrollLeft + slide.getBoundingClientRect().left - list.getBoundingClientRect().left - 24, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return <section id="work" ref={sectionRef} className={`work-section ${horizontal ? 'scroll-scene is-horizontal' : 'work-touch'}`} aria-label={t.nav[2]}>
    {horizontal ? <div className="scroll-stage work-viewport" ref={stageRef}>
      <div className="work-fixed-header"><h2 className="work-section-label">{t.workEyebrow}</h2><div className="work-progress"><div className="work-progress-line"><span style={{ width: `${(index + 1) / count * 100}%` }} /></div><b>{padded(index + 1)} / {padded(count)}</b></div></div>
      <div className="work-track" ref={trackRef}>{projects.map(project => <ProjectSlide key={project.id} {...{ project, lang, t, onOpen, horizontal }} />)}</div>
    </div> : <>
      <header className="work-mobile-heading"><h2 className="work-section-label">{t.workEyebrow}</h2><span className="work-swipe-hint">{t.workMobileHint}<ArrowRight size={16} /></span></header>
      <div className="work-touch-list" ref={mobileList} onScroll={onMobileScroll} role="region" aria-label={t.nav[2]} tabIndex={0}>{projects.map(project => <ProjectSlide key={project.id} {...{ project, lang, t, onOpen, horizontal }} />)}</div>
      <div className="work-mobile-controls"><div><button aria-label={t.previousProject} disabled={mobileIndex === 0} onClick={() => goTo(mobileIndex - 1)}><ArrowLeft size={18} /></button><button aria-label={t.nextProject} disabled={mobileIndex === count - 1} onClick={() => goTo(mobileIndex + 1)}><ArrowRight size={18} /></button></div><div className="work-mobile-progress"><span style={{ width: `${(mobileIndex + 1) / count * 100}%` }} /></div><span>{padded(mobileIndex + 1)} / {padded(count)}</span></div>
    </>}
  </section>;
}
