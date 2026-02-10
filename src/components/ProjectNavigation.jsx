import { Link, useLocation } from "react-router-dom";
import projects from "../data/projects";

export default function ProjectNavigation({
  title = "Projects",
  subtitle = "Seleziona un progetto"
}) {
  const { pathname } = useLocation();
  const currentId = Number(pathname.split("/").pop());

  return (
    <section className="project-navigation">
      <div className="project-navigation-inner">
        <header className="project-navigation-header">
          <h2>{title}</h2>
          {/*<p>{/*subtitle}</p>*/}
        </header>

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
