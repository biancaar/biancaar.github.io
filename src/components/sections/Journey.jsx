import Label from '../ui/Label.jsx';
import { timeline } from '../../data/timeline.js';
import useHorizontalScene from '../../hooks/useHorizontalScene.js';

export default function Journey({ t, lang }) {
  const stages = [...timeline].reverse();
  const { horizontal, sectionRef, stageRef, trackRef, index } = useHorizontalScene(stages.length, lang);
  return <section id="journey" ref={sectionRef} className={`journey-section ${horizontal ? 'scroll-scene is-horizontal' : 'is-vertical'}`}>
    <div className="scroll-stage" ref={stageRef}>
      <div className="journey-heading">
        <Label>{t.journeyEyebrow}</Label>
        <h2 className="display-serif">{t.journeyTitleLines[0]}<br /><em>{t.journeyTitleLines[1]}</em></h2>
        <p>{t.journeyLead}</p>
      </div>
      <div className="journey-track" ref={trackRef}>
        <div className="journey-rail" aria-hidden="true"><span className="journey-line-fill" /></div>
        {stages.map((item, position) => <article className={`journey-step ${position === index ? 'is-current' : ''}`} key={`${item.year}-${position}`}>
          <span className="journey-node" aria-hidden="true" />
          <time>{item.year}</time>
          <span className="journey-chapter">{String(position + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}</span>
          <h3 className="display-serif">{item.title[lang]}</h3>
          <p>{item.text[lang]}</p>
        </article>)}
      </div>
    </div>
  </section>;
}
