import Label from '../ui/Label.jsx';
import ArrowLink from '../ui/ArrowLink.jsx';
import { skills } from '../../data/skills.js';

export default function About({ t, lang }) {
  return <section className="about-section full-screen" id="about">
    <div className="section-padding about-layout">
      <div className="about-narrative">
        <Label light>{t.aboutEyebrow}</Label>
        <h2 className="about-title display-serif">{t.aboutTitleLines[0]}<br /><em>{t.aboutTitleLines[1]}</em></h2>
        <p>{t.about1}</p><p>{t.about2}</p>
        <ArrowLink href="#contact" className="on-light">{t.heroSecondary}</ArrowLink>
      </div>
      <div className="skills-panel">
        <div className="skills-top">{t.skillsHeading}</div>
        {skills.map((skill, i) => <div className="skill-row" key={skill.id}>
          <div className="skill-label"><span>0{i + 1}</span>{skill.name[lang]}</div>
          <div className="skill-tags">{skill.items.map(item => <span key={item}>{item}</span>)}</div>
          {skill.id === 'additional' && <p className="skills-footnote">{t.otherFoot}</p>}
        </div>)}
      </div>
    </div>
  </section>;
}
