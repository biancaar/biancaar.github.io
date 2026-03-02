import { Link, useLocation } from "react-router-dom";
import { getProjects } from "../data/projects";
import { useLanguage } from "../contexts/LanguageContext";

export default function ProjectNavigation({
  title,
  subtitle,
  compact = false,
  hideHeader = false,
  className = ""
}) {
  const { language, t } = useLanguage();
  const { pathname } = useLocation();
  const projects = getProjects(language);
  const currentId = Number(pathname.split("/").pop());
  const sectionTitle = title ?? t("project.navigationTitle");
  const sectionSubtitle = subtitle ?? t("project.navigationSubtitle");
  const navigationClass = [
    "project-navigation",
    compact ? "is-compact" : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={navigationClass}>
      <div className="project-navigation-inner">
        {!hideHeader && (
          <header className="project-navigation-header">
            <h2>{sectionTitle}</h2>
            {sectionSubtitle ? <p>{sectionSubtitle}</p> : null}
          </header>
        )}

        <nav className="project-navigation-list">
          {projects.map((p, idx) => {
            const isActive = p.id === currentId;

            return (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className={`project-navigation-item ${isActive ? "is-active" : ""}`}
              >
                <span className="project-navigation-index">
                  {String(idx + 1).padStart(2, "0")}
                </span>

                <span className="project-navigation-title">{p.title}</span>
                <span className="project-navigation-subtitle">{p.subtitle}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
