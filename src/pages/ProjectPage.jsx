import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import projects from "../data/projects";
import ProjectNavigation from "../components/ProjectNavigation";
import ProjectBlocks from "../components/ProjectBlocks";
import backToTopIcon from "../assets/arrow_upward_50dp_000_FILL0_wght400_GRAD0_opsz48.png";

const ProjectPage = () => {
  const { id } = useParams();
  const projectId = parseInt(id, 10);
  const project = projects.find((p) => p.id === projectId);
  const projectIndex = projects.findIndex((p) => p.id === projectId);
  const heroImage = project?.heroImage || project?.centerImage || project?.cover;
  const heroScale = project?.heroScale ?? project?.centerScale ?? 1;
  const heroHoverScale = heroScale * 1.06;
  const heroRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setShowBackToTop(false);

    const menu = document.querySelector(".site-menu");
    const getHeroEnd = () => {
      const heroEl = heroRef.current;
      if (!heroEl) return window.innerHeight;
      return heroEl.offsetTop + heroEl.offsetHeight;
    };

    if (menu) {
      menu.style.transform = "translateY(0)";
      menu.style.opacity = "1";
    }

    let last = window.scrollY;
    const onScroll = () => {
      const st = window.scrollY;
      const heroEnd = getHeroEnd();
      const isMobile = window.matchMedia("(max-width: 900px)").matches;

      if (isMobile) {
        if (menu) {
          menu.style.transform = "translateY(0)";
          menu.style.opacity = "1";
        }
        setShowBackToTop(st >= heroEnd);
        last = st <= 0 ? 0 : st;
        return;
      }

      if (menu) {
        if (st > last && st > 100) {
          menu.style.transform = "translateY(-120%)";
          menu.style.opacity = "0";
        } else {
          menu.style.transform = "translateY(0)";
          menu.style.opacity = "1";
        }
      }

      setShowBackToTop(st >= heroEnd);
      last = st <= 0 ? 0 : st;
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (menu) {
        menu.style.transform = "translateY(0)";
        menu.style.opacity = "1";
      }
    };
  }, [projectId]);

  if (!project) return <div style={{ color: "#fff", padding: "5rem" }}>Project not found</div>;

  return (
    <div className="project-page">
      <section ref={heroRef} className="project-detail-hero">
        <div className="project-detail-overlay" />
        <div className="project-detail-inner">
          <div className="project-detail-stage">
            <div className="project-detail-title">
              <span className="project-detail-index">
                {String(Math.max(projectIndex + 1, 1)).padStart(2, "0")}
              </span>
              <h1>{project.title}</h1>
              {project.subtitle ? <p>{project.subtitle}</p> : null}
            </div>

            <div
              className="project-detail-cutout"
              style={{
                "--center-scale": heroScale,
                "--center-hover-scale": heroHoverScale
              }}
            >
              <div
                className="project-detail-cutout-image"
                style={{ backgroundImage: `url(${heroImage})` }}
                aria-hidden="true"
              />
            </div>
          </div>

          <ProjectNavigation
            compact
            hideHeader
            className="project-navigation-hero"
          />
        </div>
      </section>

      <section className="project-detail-content">
        <ProjectBlocks blocks={project.blocks} />
      </section>

      <button
        type="button"
        className={`project-back-to-top ${showBackToTop ? "is-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <img src={backToTopIcon} alt="" aria-hidden="true" />
      </button>
    </div>
  );
};

export default ProjectPage;
