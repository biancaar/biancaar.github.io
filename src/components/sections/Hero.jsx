import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Label from '../ui/Label.jsx';
import { column } from '../../config/column.js';
import { site } from '../../data/site.js';

const ColumnExperience = lazy(() => import('../three/ColumnExperience.jsx'));

/** The sharp PNG is always present, including while JavaScript/WebGL loads. */
export default function Hero({ t }) {
  const [state, setState] = useState('loading');
  const [enable, setEnable] = useState(true);
  const loaded = useCallback(() => setState('ready'), []);
  const failed = useCallback(() => { setEnable(false); setState('failed'); }, []);
  const skip = useCallback(() => { setEnable(false); setState('skipped'); }, []);
  useEffect(() => {
    if (state !== 'loading') return;
    const timeout = setTimeout(skip, 14000);
    return () => clearTimeout(timeout);
  }, [state, skip]);

  return <section className="hero-section full-screen" id="top">
    <div className="hero-content section-padding">
      <Label>{t.heroEyebrow}</Label>
      <h1 className="hero-name display-serif">{site.heroName.map(line => <span key={line}>{line}</span>)}</h1>
      <div className="hero-rule" />
      <h2 className="hero-claim display-serif"><em>{t.heroClaim}</em></h2>
      <p className="hero-description">{t.heroDesc}</p>
      <div className="hero-actions"><a className="outlined-cta" href="#work">{t.heroCta}<ArrowUpRight size={18} /></a></div>
    </div>
    <div className={`hero-art ${state === 'ready' ? 'has-3d' : ''}`}>
      <img src={column.fallback} alt={column.alt} className="hero-static" fetchPriority="high" />
      {enable && <Suspense fallback={null}><ColumnExperience onLoaded={loaded} onFailed={failed} /></Suspense>}
    </div>
    <div className="hero-art-label">{t.asset}</div>
    {state === 'loading' && <div className="model-loading" role="status" aria-live="polite">
      <p>{t.loading}</p><span className="loading-track"><i /></span>
      <button onClick={skip}>{t.skip}<ArrowRight size={15} /></button>
    </div>}
    {state === 'failed' && <span className="model-fallback-notice" role="status">{t.modelError}</span>}
  </section>;
}
