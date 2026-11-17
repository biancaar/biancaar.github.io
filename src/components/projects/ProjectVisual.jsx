import { useState } from 'react';

/** Real project media shared by the gallery and the case-study dialog. */
export function ProjectImage({ src, alt, fit = 'cover', position = 'center' }) {
  const [failed, setFailed] = useState(false);
  return failed ? <div className="project-image-unavailable" role="img" aria-label={alt}><span>{alt}</span></div> :
    <img src={src} alt={alt} loading="lazy" decoding="async" style={{ objectFit: fit, objectPosition: position }} onError={() => setFailed(true)} />;
}

export default function ProjectVisual({ project, small = false, lang = 'en' }) {
  const comparison = project.images?.length > 0;
  return <div className={`artwork project-photograph media-${project.id} ${comparison ? 'media-comparison' : ''} ${small ? 'small' : ''}`}>
    <span className="art-label">{project.category[lang].toUpperCase()}</span>
    {comparison ? <div className="project-comparison">
      {project.images.map(image => <figure className="comparison-panel" key={image.src}>
        <ProjectImage src={image.src} alt={image.alt[lang]} fit={image.fit || 'cover'} position={image.position || 'center'} />
        <figcaption>{image.label[lang]}</figcaption>
      </figure>)}
    </div> : <>
      <ProjectImage src={project.image} alt={project.imageAlt?.[lang] || project.title[lang]} fit={project.imageFit || 'cover'} position={project.imagePosition || 'center'} />
      {project.imageHeading && <div className="project-image-heading" aria-hidden="true">{project.imageHeading[lang]}</div>}
    </>}
  </div>;
}
