import Label from '../ui/Label.jsx';
import { creative } from '../../data/creative.js';

function CreativeVisual({ item, lang }) {
  return <div className="creative-visual creative-photo">
    <img src={item.image} alt={item.imageAlt?.[lang] || item.name[lang]} loading="lazy" decoding="async" style={{ objectPosition: item.imagePosition || 'center' }} />
  </div>;
}

export default function Creative({ t, lang }) {
  return <section className="creative-section full-screen" id="creative">
    <div className="section-padding">
      <div className="creative-heading">
        <div><Label light>{t.creativeEyebrow}</Label><h2 className="display-serif">{t.creativeTitle}</h2></div>
        <p>{t.creativeLead}</p>
      </div>
      <div className="creative-grid">{creative.map((item, i) => <article className="creative-card" key={item.id}>
        <CreativeVisual {...{ item, lang }} />
        <div className="creative-card-bottom"><span>0{i + 1} / {item.tag[lang]}</span><h3 className="display-serif">{item.name[lang]}</h3></div>
      </article>)}</div>
    </div>
  </section>;
}
