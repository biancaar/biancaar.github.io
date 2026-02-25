import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projects from "../data/projects";
import timeline from "../data/timeline";
import ThreeScrollScene from "../components/ThreeScrollScene";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // HERO parallax (muovili insieme, elegante, niente sovrapposizioni strane)
      gsap.to([".hero-title", ".hero-subtitle-container"], {
        y: 30,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true
        }
      });

      // Skills card entry
      gsap.from(".skills-card", {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".skills-card",
          start: "top 75%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true
        }
      });

      mm.add("(min-width: 901px)", () => {
        const timelineSection = document.querySelector(".panel-timeline");
        const timelineList = document.querySelector(".timeline-list");
        const timelineScroll = document.querySelector(".timeline-scroll");

        if (!timelineSection || !timelineList || !timelineScroll) {
          return undefined;
        }

        const getTravel = () =>
          Math.max(timelineList.scrollHeight - timelineScroll.clientHeight + 10, 0);

        gsap.set(timelineList, { y: 0 });

        return gsap.to(timelineList, {
          y: () => -getTravel(),
          ease: "none",
          scrollTrigger: {
            trigger: timelineSection,
            start: "top top",
            end: () => `+=${Math.max(getTravel(), window.innerHeight * 0.9)}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            refreshPriority: 2,
            invalidateOnRefresh: true
          }
        });
      });

      // Horizontal projects slideshow driven by vertical scroll.
      // Must be created after timeline pin because timeline is above projects in DOM.
      mm.add("(min-width: 901px)", () => {
        const projectSection = document.querySelector(".panel-projects");
        const projectTrack = document.querySelector(".projects-track");

        if (!projectSection || !projectTrack) return undefined;

        const getScrollDistance = () =>
          Math.max(projectTrack.scrollWidth - window.innerWidth, 0);
        const getPinDistance = () =>
          Math.max(getScrollDistance() + window.innerHeight * 0.22, window.innerWidth * 0.9);

        gsap.set(projectTrack, { x: 0 });

        return gsap.to(projectTrack, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: projectSection,
            start: "top top",
            end: () => `+=${getPinDistance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            refreshPriority: 1,
            invalidateOnRefresh: true
          }
        });
      });

      gsap.from(".project-slide-card", {
        opacity: 0,
        y: 32,
        duration: 0.85,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".panel-projects",
          start: "top 75%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true
        }
      });

      gsap.from(".timeline-item", {
        opacity: 0,
        y: 36,
        duration: 0.75,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".panel-timeline",
          start: "top 70%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true
        }
      });

      // Menu hide/show on scroll (come prima)
      let last = window.scrollY;
      const menu = document.querySelector(".site-menu");

      const onScroll = () => {
        const st = window.scrollY;
        if (!menu) return;

        if (st > last && st > 100) {
          menu.style.transform = "translateY(-120%)";
          menu.style.opacity = "0";
        } else {
          menu.style.transform = "translateY(0)";
          menu.style.opacity = "1";
        }
        last = st <= 0 ? 0 : st;
      };

      window.addEventListener("scroll", onScroll);

      // cleanup listener quando smonti pagina
      return () => window.removeEventListener("scroll", onScroll);
    });

    // IMPORTANTISSIMO: refresh dopo mount + immagini
    const t = setTimeout(() => ScrollTrigger.refresh(), 150);

    // refresh anche quando tutte le risorse sono caricate
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      clearTimeout(t);
      window.removeEventListener("load", onLoad);
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <>
      <ThreeScrollScene />

      {/* HERO */}
      <section className="panel hero">
        <h1 className="hero-title">ROTARU BIANCA</h1>

        <div className="hero-subtitle-container">
          <p className="hero-subtitle">
            CREATIVE DEVELOPER<br />
            3D & INTERACTIVE EXPERIENCES
          </p>
        </div>
      </section>

      {/* ABOUT + SKILLS */}
      <section id="about" className="panel panel-skills">
        <div className="about-content">
          <h2>About Me</h2>
          <p>
            La mia passione per la programmazione è nata a 14 anni, iniziando con il <strong>design web</strong> e la creazione di siti semplici. Ho poi approfondito <strong>SQL, JavaScript e PHP</strong>.
          </p>
          <br />
          <p>
            Durante gli anni scolastici ho imparato linguaggi come <strong>C++, C# e Java</strong>, sviluppando un <strong>metodo di problem solving</strong> e un approccio strutturato al ragionamento.
          </p>
          <br />
           <p>
            Invece durante l'ultima esperienza lavorativa ho avuto l'opportunità di esplorare il mondo del <strong>3D e della realtà virtuale</strong>, utilizzando strumenti come <strong>Unity, Blender e Substance Painter</strong>. Questa esperienza ha arricchito la mia prospettiva, permettendomi di unire competenze tecniche a una sensibilità estetica, con l'obiettivo di creare <strong>esperienze digitali coinvolgenti e innovative</strong>.
          </p>
          <br />
          <div className="skills-card">
            <h3 className="skills-title">SKILLS</h3>

            <div className="skills-grid">
              <div className="skill-col">
                <div className="skill-head">WEB DEV</div>
                <div className="skill-body">React, JS, CSS, PHP, SQL</div>
              </div>

              <div className="skill-col">
                <div className="skill-head">3D &amp; VR DEV</div>
                <div className="skill-body">Unity, Blender, Substance Painter</div>
              </div>

              <div className="skill-col">
                <div className="skill-head">SOFTWARE DEV</div>
                <div className="skill-body">C++, C#, Java</div>
              </div>
            </div>
          </div>
        </div>


      </section>

      {/* TIMELINE */}
      <section id="timeline" className="panel panel-timeline">
        <div className="timeline-inner">
          <header className="timeline-header">
            <h2>Esperienze e Formazione</h2>
          </header>

          <div className="timeline-scroll">
            <div className="timeline-list">
              {timeline.map((item, idx) => (
                <article
                  key={`${item.period}-${item.title}`}
                  className={`timeline-item ${idx % 2 === 0 ? "is-left" : "is-right"}`}
                >
                  <div className="timeline-content">
                    <div className="timeline-period">{item.period}</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                  <div className="timeline-node">
                    <span>{idx + 1}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="panel panel-projects">
        <div className="projects-background" aria-hidden="true" />
        <div className="projects-edge-right" aria-hidden="true" />

        <div className="projects-heading">
          <h2>Projects</h2>
        </div>

        <div className="projects-horizontal">
          <div className="projects-track">
            {projects.map((p, idx) => {
              const mediaSources = (p.blocks || []).flatMap((block) => {
                if (block.type === "image" && block.src) return [block.src];
                if (block.type === "gallery" && block.images?.length) {
                  return block.images.map((img) => img.src).filter(Boolean);
                }
                if (block.type === "split" && block.media?.src) {
                  return [block.media.src];
                }
                return [];
              });

              const centerImage = p.centerImage || p.cover;
              const previewVideo = p.previewVideo || "";
              const previewTitle = p.previewTitle || p.title;
              const miniThumbA = p.previewImageA || mediaSources[1] || mediaSources[0] || p.cover;
              const miniThumbB = p.previewImageB || mediaSources[2] || mediaSources[1] || p.cover;
              const centerScale = p.centerScale ?? 1;
              const centerHoverScale = centerScale * 1.06;
              const previewVideoScale = p.previewVideoScale ?? 1;

              return (
                <article key={p.id} className="project-slide">
                  <div className="project-slide-card">
                    <div className="project-slide-left">
                      <span className="project-slide-index">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h3>{p.title}</h3>
                      <p>{p.subtitle}</p>
                      <Link to={`/projects/${p.id}`} className="project-slide-cta">
                        View Project
                      </Link>
                    </div>

                    <Link
                      to={`/projects/${p.id}`}
                      className="project-slide-cutout"
                      aria-label={`Open ${p.title}`}
                      style={{
                        "--center-scale": centerScale,
                        "--center-hover-scale": centerHoverScale
                      }}
                    >
                      <div
                        className="project-slide-cutout-image"
                        style={{ backgroundImage: `url(${centerImage})` }}
                      />
                    </Link>

                    <div className="project-slide-right">
                      <Link
                        to={`/projects/${p.id}`}
                        className="project-video-thumb"
                        aria-label={`Open ${p.title} preview`}
                      >
                        {previewVideo ? (
                          <video
                            className="project-video-thumb-video"
                            src={previewVideo}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            style={{ "--preview-video-scale": previewVideoScale }}
                          />
                        ) : (
                          <div
                            className="project-video-thumb-video"
                            style={{
                              backgroundImage: `url(${miniThumbA})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center"
                            }}
                          />
                        )}
                      </Link>

                      <div className="project-video-title">{previewTitle}</div>

                      <div className="project-mini-grid">
                        <div
                          className="project-mini-thumb"
                          style={{ backgroundImage: `url(${miniThumbA})` }}
                        />
                        <div
                          className="project-mini-thumb"
                          style={{ backgroundImage: `url(${miniThumbB})` }}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
            <div className="projects-track-tail" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="panel panel-contact">
        <div className="contact-content">
          <h2>Contact Me</h2>
          <p>
            Sono attualmente alla ricerca di nuove opportunità nel <strong>web development</strong>,
            con particolare interesse per progetti che uniscano <strong>design, interazione e tecnologia</strong>.
          </p>

          <p>
            Se pensi che il mio profilo possa essere adatto al tuo team o a un progetto,
            sarò felice di parlarne.
          </p>
          <p>
            <strong>Cellulare: +39 345 242 1558
              <br />
              E-mail: bianca.rotaru.a@gmail.com
            </strong>
          </p>
        </div>
          <div className="contact-right">
        <div className="contact-form-card">
          <form action="https://formspree.io/f/mnjjjqov" method="POST">
            <label>
              Name
              <input name="name" type="text" placeholder="Your name" required />
            </label>

            <label>
              Email
              <input name="email" type="email" placeholder="Your email" required />
            </label>

            <label>
              Message
              <textarea name="message" placeholder="Tell me about your project" rows="4" required />
            </label>

            <button type="submit">Send Message</button>
          </form>
        </div></div>
      </section>
    </>
  );
}
