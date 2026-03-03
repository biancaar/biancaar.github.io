import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getProjects } from "../data/projects";
import { getTimeline } from "../data/timeline";
import swipeDownIcon from "../assets/swipe_down_40dp_FFFFFF_FILL0_wght400_GRAD0_opsz40.png";
import ThreeScrollScene from "../components/ThreeScrollScene";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_QUERY = "(orientation: landscape)";
const MOBILE_QUERY = "(orientation: portrait)";

// Collect media assets used to populate the project cards.
const collectProjectMediaSources = (blocks = []) =>
  blocks.flatMap((block) => {
    if (block.type === "image" && block.src) return [block.src];
    if (block.type === "gallery" && block.images?.length) {
      return block.images.map((img) => img.src).filter(Boolean);
    }
    if (block.type === "split" && block.media?.src) return [block.media.src];
    return [];
  });

const getProjectSlideMedia = (project) => {
  const mediaSources = collectProjectMediaSources(project.blocks);
  const centerImage = project.centerImage || project.cover;
  const previewVideo = project.previewVideo || "";
  const previewTitle = project.previewTitle || project.title;
  const miniThumbA =
    project.previewImageA || mediaSources[1] || mediaSources[0] || project.cover;
  const miniThumbB =
    project.previewImageB || mediaSources[2] || mediaSources[1] || project.cover;
  const centerScale = project.centerScale ?? 1;
  const centerHoverScale = centerScale * 1.06;
  const previewVideoScale = project.previewVideoScale ?? 1;

  return {
    centerImage,
    previewVideo,
    previewTitle,
    miniThumbA,
    miniThumbB,
    centerScale,
    centerHoverScale,
    previewVideoScale
  };
};

export default function HomePage() {
  const { language, t } = useLanguage();
  const projects = getProjects(language);
  const timeline = getTimeline(language);
  const aboutParagraphs = t("home.about.paragraphs");
  const contactParagraphs = t("home.contact.paragraphs");

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
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

      mm.add(DESKTOP_QUERY, () => {
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

      // Shared horizontal projects animation used by desktop and mobile configs.
      const createProjectsHorizontalTween = ({
        pinExtraFactor,
        minPinDistance,
        scrub,
        anticipatePin,
        refreshPriority,
        fastScrollEnd,
        leadInFactor = 0,
        enableTouchDrag = false,
        touchDragFactor = 1
      }) => {
        const projectSection = document.querySelector(".panel-projects");
        const projectTrack = document.querySelector(".projects-track");

        if (!projectSection || !projectTrack) return undefined;

        const getScrollDistance = () =>
          Math.max(projectTrack.scrollWidth - window.innerWidth, 0);
        const getBasePinDistance = () =>
          Math.max(
            getScrollDistance() + window.innerHeight * pinExtraFactor,
            minPinDistance()
          );
        const getLeadInDistance = () => window.innerHeight * Math.max(leadInFactor, 0);
        const getPinDistance = () => getBasePinDistance() + getLeadInDistance();

        gsap.set(projectTrack, { x: 0 });

        const scrollTrigger = {
          trigger: projectSection,
          start: "top top",
          end: () => `+=${getPinDistance()}`,
          scrub,
          pin: true,
          anticipatePin,
          invalidateOnRefresh: true
        };

        if (typeof refreshPriority === "number") {
          scrollTrigger.refreshPriority = refreshPriority;
        }

        if (typeof fastScrollEnd === "boolean") {
          scrollTrigger.fastScrollEnd = fastScrollEnd;
        }

        const bindMobileTouchDrag = (tweenInstance) => {
          let startX = 0;
          let startY = 0;
          let lastX = 0;
          let trackingTouch = false;
          let lockHorizontal = false;

          const scrollingElement = document.scrollingElement || document.documentElement;
          const prevDocScrollBehavior = document.documentElement.style.scrollBehavior;
          const prevBodyScrollBehavior = document.body.style.scrollBehavior;
          const prevTouchAction = projectSection.style.touchAction;

          const lockThreshold = 3;

          const enableInstantScrollBehavior = () => {
            document.documentElement.style.scrollBehavior = "auto";
            document.body.style.scrollBehavior = "auto";
          };

          const restoreScrollBehavior = () => {
            document.documentElement.style.scrollBehavior = prevDocScrollBehavior;
            document.body.style.scrollBehavior = prevBodyScrollBehavior;
          };

          const onTouchStart = (event) => {
            if (event.touches.length !== 1) return;
            const touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            lastX = touch.clientX;
            trackingTouch = true;
            lockHorizontal = false;
            enableInstantScrollBehavior();
          };

          const onTouchMove = (event) => {
            if (!trackingTouch || event.touches.length !== 1) return;

            const touch = event.touches[0];
            const totalDeltaX = touch.clientX - startX;
            const totalDeltaY = touch.clientY - startY;

            if (!lockHorizontal) {
              const passedThreshold =
                Math.abs(totalDeltaX) > lockThreshold || Math.abs(totalDeltaY) > lockThreshold;
              if (!passedThreshold) return;

              lockHorizontal = Math.abs(totalDeltaX) >= Math.abs(totalDeltaY) * 0.85;
              if (!lockHorizontal) return;
            }

            if (!lockHorizontal) return;

            const trigger = tweenInstance?.scrollTrigger;
            if (!trigger) return;

            const currentScroll = scrollingElement.scrollTop;
            if (currentScroll < trigger.start || currentScroll > trigger.end) return;

            event.preventDefault();

            const deltaX = touch.clientX - lastX;
            const scrollDistance = getScrollDistance();
            if (scrollDistance <= 0) return;

            const pinDistance = Math.max(trigger.end - trigger.start, 1);
            const currentX = Number(gsap.getProperty(projectTrack, "x")) || 0;
            const nextX = gsap.utils.clamp(
              -scrollDistance,
              0,
              currentX + deltaX * touchDragFactor
            );
            const nextProgress = -nextX / scrollDistance;
            const nextScroll = trigger.start + nextProgress * pinDistance;

            gsap.set(projectTrack, { x: nextX });
            scrollingElement.scrollTop = nextScroll;
            trigger.update();

            lastX = touch.clientX;
          };

          const onTouchEnd = () => {
            trackingTouch = false;
            lockHorizontal = false;
            restoreScrollBehavior();
          };

          projectSection.style.touchAction = "pan-y";
          projectSection.addEventListener("touchstart", onTouchStart, { passive: true });
          projectSection.addEventListener("touchmove", onTouchMove, { passive: false });
          projectSection.addEventListener("touchend", onTouchEnd);
          projectSection.addEventListener("touchcancel", onTouchEnd);

          return () => {
            projectSection.style.touchAction = prevTouchAction;
            projectSection.removeEventListener("touchstart", onTouchStart);
            projectSection.removeEventListener("touchmove", onTouchMove);
            projectSection.removeEventListener("touchend", onTouchEnd);
            projectSection.removeEventListener("touchcancel", onTouchEnd);
            restoreScrollBehavior();
          };
        };

        let tween;
        if (leadInFactor > 0) {
          const updateTrackPosition = (progress) => {
            const totalDistance = Math.max(getPinDistance(), 1);
            const leadInProgress = Math.min(getLeadInDistance() / totalDistance, 0.9);
            const normalizedProgress =
              (progress - leadInProgress) / Math.max(1 - leadInProgress, 0.0001);
            const clampedProgress = Math.min(Math.max(normalizedProgress, 0), 1);
            gsap.set(projectTrack, { x: -getScrollDistance() * clampedProgress });
          };

          scrollTrigger.onUpdate = (self) => updateTrackPosition(self.progress);
          scrollTrigger.onRefresh = (self) => updateTrackPosition(self.progress);

          tween = gsap.to({}, {
            duration: 1,
            ease: "none",
            scrollTrigger
          });
        } else {
          tween = gsap.to(projectTrack, {
            x: () => -getScrollDistance(),
            ease: "none",
            scrollTrigger
          });
        }

        const unbindTouchDrag =
          enableTouchDrag && window.matchMedia(MOBILE_QUERY).matches
            ? bindMobileTouchDrag(tween)
            : () => {};

        return () => {
          unbindTouchDrag();
          tween?.scrollTrigger?.kill?.();
          tween?.kill?.();
        };

      };

      mm.add(DESKTOP_QUERY, () =>
        createProjectsHorizontalTween({
          pinExtraFactor: 0.22,
          minPinDistance: () => window.innerWidth * 0.9,
          scrub: 1,
          anticipatePin: 1,
          refreshPriority: 1
        })
      );

      mm.add(MOBILE_QUERY, () =>
        createProjectsHorizontalTween({
          // Extra pin distance on mobile so the final swipe-down hint is reachable.
          pinExtraFactor: 0.10,
          minPinDistance: () => window.innerHeight * 0.50,
          scrub: 0.05,
          anticipatePin: 0,
          fastScrollEnd: false,
          leadInFactor: 0,
          enableTouchDrag: true
        })
      );

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

      let last = window.scrollY;
      const menu = document.querySelector(".site-menu");

      const onScroll = () => {
        const st = window.scrollY;
        if (!menu) return;
        const isMobile = window.matchMedia(MOBILE_QUERY).matches;

        if (isMobile) {
          menu.style.transform = "translateY(0)";
          menu.style.opacity = "1";
          last = st <= 0 ? 0 : st;
          return;
        }

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
      return () => window.removeEventListener("scroll", onScroll);
    });

    const t = setTimeout(() => ScrollTrigger.refresh(), 150);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      clearTimeout(t);
      window.removeEventListener("load", onLoad);
      mm.revert();
      ctx.revert();
    };
  }, [language]);

  return (
    <>
      <ThreeScrollScene />

      <section className="panel hero">
        <h1 className="hero-title">ROTARU BIANCA</h1>

        <div className="hero-subtitle-container">
          <p className="hero-subtitle">
            {t("hero.subtitleLine1")}<br />
            {t("hero.subtitleLine2")}
          </p>
        </div>
      </section>

      <section id="about" className="panel panel-skills">
        <div className="about-content">
          <h2>{t("home.about.title")}</h2>
          {aboutParagraphs.map((paragraph, index) => (
            <div key={`about-${index}`}>
              <p>{paragraph}</p>
              {index < aboutParagraphs.length - 1 ? <br /> : null}
            </div>
          ))}
          <br />
          <div className="skills-card">
            <h3 className="skills-title">{t("home.about.skillsTitle")}</h3>

            <div className="skills-grid">
              <div className="skill-col">
                <div className="skill-head">{t("home.about.skills.webDev")}</div>
                <div className="skill-body">React, JS, CSS, PHP, SQL</div>
              </div>

              <div className="skill-col">
                <div className="skill-head">{t("home.about.skills.vrDev")}</div>
                <div className="skill-body">Unity, Blender, Substance Painter</div>
              </div>

              <div className="skill-col">
                <div className="skill-head">{t("home.about.skills.softwareDev")}</div>
                <div className="skill-body">C++, C#, Java</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="timeline" className="panel panel-timeline">
        <div className="timeline-inner">
          <header className="timeline-header">
            <h2>{t("home.timeline.title")}</h2>
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

      <section id="projects" className="panel panel-projects">
        <div className="projects-background" aria-hidden="true" />
        <div className="projects-edge-right" aria-hidden="true" />

        <div className="projects-heading">
          <h2>{t("home.projects.title")}</h2>
        </div>

        <div className="projects-horizontal">
          <div className="projects-track">
            {projects.map((project, idx) => {
              const {
                centerImage,
                previewVideo,
                previewTitle,
                miniThumbA,
                miniThumbB,
                centerScale,
                centerHoverScale,
                previewVideoScale
              } = getProjectSlideMedia(project);

              return (
                <article key={project.id} className="project-slide">
                  <div className="project-slide-shell">
                    <h3 className="project-slide-mobile-title">{project.title}</h3>
                    <div className="project-slide-card">
                      <div className="project-slide-left">
                        <span className="project-slide-index">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <h3>{project.title}</h3>
                        <p>{project.subtitle}</p>
                        <Link to={`/projects/${project.id}`} className="project-slide-cta">
                          {t("home.projects.viewProject")}
                        </Link>
                      </div>

                      <Link
                        to={`/projects/${project.id}`}
                        className="project-slide-cutout"
                        aria-label={`Open ${project.title}`}
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
                          to={`/projects/${project.id}`}
                          className="project-video-thumb"
                          aria-label={`Open ${project.title} preview`}
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

                        <Link
                          to={`/projects/${project.id}`}
                          className="project-slide-mobile-cta"
                        >
                          {t("home.projects.viewProject")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
            <div className="projects-mobile-scroll-hint" aria-hidden="true">
              <img src={swipeDownIcon} alt="" />
            </div>
            <div className="projects-track-tail" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section id="contact" className="panel panel-contact">
        <div className="contact-content">
          <h2>{t("home.contact.title")}</h2>
          {contactParagraphs.map((paragraph, index) => (
            <p key={`contact-${index}`}>{paragraph}</p>
          ))}
          <p>
            <strong>{t("home.contact.phoneLabel")}: +39 345 242 1558
              <br />
              {t("home.contact.emailLabel")}: bianca.rotaru.a@gmail.com
            </strong>
          </p>
        </div>
        <div className="contact-right">
          <div className="contact-form-card">
            <form action="https://formspree.io/f/mnjjjqov" method="POST">
              <label>
                {t("home.contact.form.nameLabel")}
                <input
                  name="name"
                  type="text"
                  placeholder={t("home.contact.form.namePlaceholder")}
                  autoComplete="name"
                  required
                />
              </label>

              <label>
                {t("home.contact.form.emailLabel")}
                <input
                  name="email"
                  type="email"
                  placeholder={t("home.contact.form.emailPlaceholder")}
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                {t("home.contact.form.messageLabel")}
                <textarea
                  name="message"
                  placeholder={t("home.contact.form.messagePlaceholder")}
                  rows="4"
                  autoComplete="off"
                  required
                />
              </label>

              <button type="submit">{t("home.contact.form.submit")}</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
