export default function ProjectIntroCard({ title, subtitle, cover }) {
  return (
    <section className="project-intro">
      <div className="project-intro-card">
        <div
          className="project-intro-image"
          style={{ backgroundImage: `url(${cover})` }}
          aria-hidden="true"
        />
        <div className="project-intro-title">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
