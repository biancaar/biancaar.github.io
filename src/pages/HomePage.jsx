import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getProjects } from "../data/projects";
import { getTimeline } from "../data/timeline";
import ThreeScrollScene from "../components/ThreeScrollScene";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import useRevealOnScroll from "../hooks/useRevealOnScroll";
import cvPdf from "../assets/CVRotaruBiancaAndreea_Public.pdf";
import swipeHintIcon from "../assets/swipe_40dp_FFFFFF_FILL0_wght400_GRAD0_opsz40.png";
import swipeDownIcon from "../assets/swipe_down_40dp_FFFFFF_FILL0_wght400_GRAD0_opsz40.png";
import backToTopIcon from "../assets/arrow_upward_50dp_000_FILL0_wght400_GRAD0_opsz48.png";
import {
  HOME_ABOUT_FOCUS_ITEMS,
  HOME_BACK_TO_TOP_SETTINGS,
  HOME_HERO_PARALLAX_SETTINGS,
  HOME_MEDIA_QUERIES,
  HOME_PROJECTS_SCROLL_SETTINGS,
  HOME_PROJECT_TIP_MODES,
  HOME_REVEAL_SETTINGS,
  HOME_TIMELINE_NODE_ICONS,
  HOME_TIMELINE_SETTINGS
} from "../config/homePage.config";
import {
  getProjectsTouchTipMode,
  getProjectSlideMedia,
  isLowEndMobileDevice
} from "./home/homePage.utils";
import { SITE_CONFIG } from "../config/site.config";
import { subscribeMediaQueryChange } from "../utils/mediaQuery";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const { language, t } = useLanguage();
  const projects = getProjects(language);
  const timeline = getTimeline(language);
  const aboutParagraphs = t("home.about.paragraphs");
  const aboutFocusItems = HOME_ABOUT_FOCUS_ITEMS;
  const contactParagraphs = t("home.contact.paragraphs");
  const [projectsTouchTipMode, setProjectsTouchTipMode] = useState(HOME_PROJECT_TIP_MODES.swipe);
  const [showHomeBackToTop, setShowHomeBackToTop] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(1);
  const activeProjectIndexRef = useRef(1);

  // Tracks the mobile swipe hint state for the projects area.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mobileMq = window.matchMedia(HOME_MEDIA_QUERIES.mobile);
    const projectsHorizontal = document.querySelector(".projects-horizontal");
    let rafId = 0;

    const updateTouchTipVisibility = () => {
      const nextMode = getProjectsTouchTipMode({
        isMobile: mobileMq.matches,
        projectsHorizontal
      });
      setProjectsTouchTipMode((prevMode) => (prevMode === nextMode ? prevMode : nextMode));
    };

    const scheduleUpdate = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateTouchTipVisibility);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    projectsHorizontal?.addEventListener("scroll", scheduleUpdate, { passive: true });
    const unsubscribeMediaQuery = subscribeMediaQueryChange(mobileMq, scheduleUpdate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      projectsHorizontal?.removeEventListener("scroll", scheduleUpdate);
      unsubscribeMediaQuery();
    };
  }, []);

  useRevealOnScroll({
    ...HOME_REVEAL_SETTINGS,
    dependencyKey: language
  });

  // Shows desktop back-to-top button after the first viewport.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const onScroll = () => {
      const isDesktopViewport =
        window.matchMedia(HOME_MEDIA_QUERIES.desktop).matches &&
        window.innerWidth >= HOME_BACK_TO_TOP_SETTINGS.desktopMinWidth;
      if (!isDesktopViewport) {
        setShowHomeBackToTop(false);
        return;
      }
      setShowHomeBackToTop(
        window.scrollY >
          window.innerHeight * HOME_BACK_TO_TOP_SETTINGS.thresholdViewportMultiplier
      );
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const root = document.documentElement;
    const prefersReducedMotionMq = window.matchMedia(HOME_MEDIA_QUERIES.reducedMotion);

    const syncMobilePerformanceClass = () => {
      root.classList.toggle("is-mobile-low-end", isLowEndMobileDevice());
    };

    syncMobilePerformanceClass();
    window.addEventListener("resize", syncMobilePerformanceClass);
    const unsubscribeReducedMotion = subscribeMediaQueryChange(
      prefersReducedMotionMq,
      syncMobilePerformanceClass
    );

    const ctx = gsap.context(() => {
      mm.add(HOME_MEDIA_QUERIES.desktop, () => {
        gsap.to([".hero-title", ".hero-subtitle-container"], {
          y: HOME_HERO_PARALLAX_SETTINGS.desktopY,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true
          }
        });
      });

      mm.add(HOME_MEDIA_QUERIES.mobile, () => {
        const lowEnd = isLowEndMobileDevice();
        const heroMobileSettings = lowEnd
          ? HOME_HERO_PARALLAX_SETTINGS.mobile.lowEnd
          : HOME_HERO_PARALLAX_SETTINGS.mobile.regular;

        const titleTween = gsap.to(".hero-title", {
          y: heroMobileSettings.title.y,
          scale: heroMobileSettings.title.scale,
          opacity: heroMobileSettings.title.opacity,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: heroMobileSettings.title.scrub,
            invalidateOnRefresh: true
          }
        });

        const subtitleTween = gsap.to(".hero-subtitle-container", {
          y: heroMobileSettings.subtitle.y,
          opacity: heroMobileSettings.subtitle.opacity,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: heroMobileSettings.subtitle.scrub,
            invalidateOnRefresh: true
          }
        });

        return () => {
          titleTween?.scrollTrigger?.kill?.();
          titleTween?.kill?.();
          subtitleTween?.scrollTrigger?.kill?.();
          subtitleTween?.kill?.();
        };
      });

      mm.add(HOME_MEDIA_QUERIES.desktop, () => {
        const timelineSection = document.querySelector(".panel-timeline");
        const timelineList = document.querySelector(".timeline-list");
        const timelineScroll = document.querySelector(".timeline-scroll");

        if (!timelineSection || !timelineList || !timelineScroll) {
          return undefined;
        }

        const getTravel = () =>
          Math.max(
            timelineList.scrollHeight -
              timelineScroll.clientHeight +
              HOME_TIMELINE_SETTINGS.desktopTravelExtraPx,
            0
          );
        const updateTimelineProgress = (progress) => {
          timelineSection.style.setProperty("--timeline-progress", (Number(progress) || 0).toFixed(4));
        };

        gsap.set(timelineList, { y: 0 });
        updateTimelineProgress(0);

        return gsap.to(timelineList, {
          y: () => -getTravel(),
          ease: "none",
          scrollTrigger: {
            trigger: timelineSection,
            start: "top top",
            end: () =>
              `+=${Math.max(
                getTravel(),
                window.innerHeight * HOME_TIMELINE_SETTINGS.desktopMinPinViewportFactor
              )}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            refreshPriority: 2,
            invalidateOnRefresh: true,
            onUpdate: (self) => updateTimelineProgress(self.progress),
            onRefresh: (self) => updateTimelineProgress(self.progress)
          }
        });
      });

      mm.add(HOME_MEDIA_QUERIES.mobile, () => {
        const timelineSection = document.querySelector(".panel-timeline");
        if (!timelineSection) return undefined;

        const updateTimelineProgress = (progress) => {
          timelineSection.style.setProperty("--timeline-progress", (Number(progress) || 0).toFixed(4));
        };

        updateTimelineProgress(0);

        const trigger = ScrollTrigger.create({
          trigger: timelineSection,
          start: HOME_TIMELINE_SETTINGS.mobileStart,
          end: HOME_TIMELINE_SETTINGS.mobileEnd,
          scrub: HOME_TIMELINE_SETTINGS.mobileScrub,
          invalidateOnRefresh: true,
          onUpdate: (self) => updateTimelineProgress(self.progress),
          onRefresh: (self) => updateTimelineProgress(self.progress)
        });

        return () => {
          timelineSection.style.removeProperty("--timeline-progress");
          trigger.kill();
        };
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
        const slideCount = Math.max(projectTrack.querySelectorAll(".project-slide").length, 1);

        const updateProjectsProgress = (progressRaw) => {
          const progress = gsap.utils.clamp(0, 1, Number(progressRaw) || 0);
          projectSection.style.setProperty("--projects-progress", progress.toFixed(4));

          const nextIndex = Math.min(
            slideCount,
            Math.max(1, Math.round(progress * (slideCount - 1)) + 1)
          );
          if (activeProjectIndexRef.current !== nextIndex) {
            activeProjectIndexRef.current = nextIndex;
            setActiveProjectIndex(nextIndex);
          }
        };

        gsap.set(projectTrack, { x: 0 });
        updateProjectsProgress(0);

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
            updateProjectsProgress(clampedProgress);
          };

          scrollTrigger.onUpdate = (self) => updateTrackPosition(self.progress);
          scrollTrigger.onRefresh = (self) => updateTrackPosition(self.progress);

          tween = gsap.to({}, {
            duration: 1,
            ease: "none",
            scrollTrigger
          });
        } else {
          scrollTrigger.onUpdate = (self) => updateProjectsProgress(self.progress);
          scrollTrigger.onRefresh = (self) => updateProjectsProgress(self.progress);

          tween = gsap.to(projectTrack, {
            x: () => -getScrollDistance(),
            ease: "none",
            scrollTrigger
          });
        }

        const unbindTouchDrag =
          enableTouchDrag && window.matchMedia(HOME_MEDIA_QUERIES.mobile).matches
            ? bindMobileTouchDrag(tween)
            : () => {};

        return () => {
          unbindTouchDrag();
          projectSection.style.removeProperty("--projects-progress");
          tween?.scrollTrigger?.kill?.();
          tween?.kill?.();
        };

      };

      mm.add(HOME_MEDIA_QUERIES.desktop, () =>
        createProjectsHorizontalTween({
          pinExtraFactor: HOME_PROJECTS_SCROLL_SETTINGS.desktop.pinExtraFactor,
          minPinDistance: () =>
            window.innerWidth * HOME_PROJECTS_SCROLL_SETTINGS.desktop.minPinDistanceViewportFactor,
          scrub: HOME_PROJECTS_SCROLL_SETTINGS.desktop.scrub,
          anticipatePin: HOME_PROJECTS_SCROLL_SETTINGS.desktop.anticipatePin,
          refreshPriority: HOME_PROJECTS_SCROLL_SETTINGS.desktop.refreshPriority
        })
      );

      mm.add(HOME_MEDIA_QUERIES.mobile, () => {
        const projectTrack = document.querySelector(".projects-track");
        if (projectTrack) {
          gsap.set(projectTrack, { clearProps: "transform" });
        }
        return undefined;
      });

      let last = window.scrollY;
      const menu = document.querySelector(".site-menu");

      const onScroll = () => {
        const st = window.scrollY;
        if (!menu) return;
        const isMobile = window.matchMedia(HOME_MEDIA_QUERIES.mobile).matches;

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
      window.removeEventListener("resize", syncMobilePerformanceClass);
      unsubscribeReducedMotion();
      root.classList.remove("is-mobile-low-end");
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
        <div className="about-ornament about-ornament-top" aria-hidden="true" />
        <div className="about-ornament about-ornament-bottom" aria-hidden="true" />
        <div className="about-content">
          <h2 data-reveal data-reveal-order="0">{t("home.about.title")}</h2>
          {aboutParagraphs.map((paragraph, index) => (
            <div key={`about-${index}`} data-reveal data-reveal-order={index + 1}>
              <p>{paragraph}</p>
              {index < aboutParagraphs.length - 1 ? <br /> : null}
            </div>
          ))}
          <div
            className="about-focus-card"
            data-reveal="card"
            data-reveal-order={aboutParagraphs.length + 1}
          >
            <p className="about-focus-label">{t("home.about.focusLabel")}</p>
            <div className="about-focus-list">
              {aboutFocusItems.map((item, index) => (
                <span key={`about-focus-${index}`} className="about-focus-chip">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <br />
          <div
            className="skills-card"
            data-reveal="card"
            data-reveal-order={aboutParagraphs.length + 2}
          >
            <h3 className="skills-title">SKILLS</h3>

            <div className="skills-grid">
              <div className="skill-col">
                <div className="skill-head">WEB DEV</div>
                <div className="skill-body">React, JS, CSS, PHP, SQL</div>
              </div>

              <div className="skill-col">
                <div className="skill-head">APPS</div>
                <div className="skill-body">Unity, Blender, Substance Painter, Photoshop, Illustrator</div>
              </div>

              <div className="skill-col">
                <div className="skill-head">SOFTWARE DEV</div>
                <div className="skill-body">C++, C#, Java</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="timeline" className="panel panel-timeline">
        <div className="timeline-inner">
          <div className="timeline-ornament timeline-ornament-top" aria-hidden="true" />
          <div className="timeline-ornament timeline-ornament-bottom" aria-hidden="true" />
          <header className="timeline-header">
            <h2 data-reveal data-reveal-order="0">{t("home.timeline.title")}</h2>
            <p className="timeline-meta" data-reveal data-reveal-order="1">
              {t("home.timeline.meta")}
            </p>
          </header>

          <div className="timeline-scroll">
            <div className="timeline-list">
              {timeline.map((item, idx) => (
                <article
                  key={`${item.period}-${item.title}`}
                  className={`timeline-item ${idx % 2 === 0 ? "is-left" : "is-right"}`}
                  data-reveal="card"
                  data-reveal-order={idx}
                  data-reveal-stagger="0.08"
                >
                  <div className="timeline-content">
                    <div className="timeline-period">{item.period}</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                  <div className="timeline-node">
                    <img
                      src={
                        HOME_TIMELINE_NODE_ICONS[idx] ||
                        HOME_TIMELINE_NODE_ICONS[HOME_TIMELINE_NODE_ICONS.length - 1]
                      }
                      alt=""
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="panel panel-projects">
        <div className="projects-background" aria-hidden="true" />
        <div className="projects-decor projects-decor-noise" aria-hidden="true" />
        <div className="projects-edge-right" aria-hidden="true" />
        <div className="projects-count" aria-hidden="true">
          <span>{String(activeProjectIndex).padStart(2, "0")}</span>
          <span className="projects-count-sep">/</span>
          <span>{String(projects.length).padStart(2, "0")}</span>
        </div>
        <div
          className={`projects-mobile-touch-tip ${projectsTouchTipMode === "hidden" ? "is-hidden" : ""} ${projectsTouchTipMode === "down" ? "is-down" : ""}`}
          aria-hidden="true"
        >
          <div className="projects-mobile-touch-tip-fade projects-mobile-touch-tip-fade-top" />
          <div className="projects-mobile-touch-tip-fade projects-mobile-touch-tip-fade-bottom" />
          <div className="projects-mobile-touch-tip-content">
            <img
              src={projectsTouchTipMode === "down" ? swipeDownIcon : swipeHintIcon}
              alt=""
              className={`projects-mobile-touch-tip-icon ${projectsTouchTipMode === "down" ? "is-down" : ""}`}
            />
            <span className="projects-mobile-touch-tip-label">
              {projectsTouchTipMode === "down" ? "DOWN" : "SWIPE"}
            </span>
          </div>
        </div>

        <div className="projects-heading">
          <h2 data-reveal data-reveal-order="0">{t("home.projects.title")}</h2>
        </div>

        <div className="projects-horizontal" aria-label={t("home.projects.title")}>
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
                <article
                  key={project.id}
                  className="project-slide"
                  data-reveal="card"
                  data-reveal-order={idx}
                  data-reveal-stagger="0.1"
                >
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
            <div className="projects-track-tail" aria-hidden="true" />
          </div>
        </div>
        <div className="projects-mobile-scroll-hint" aria-hidden="true">
          {projects.map((project, index) => (
            <span
              key={`project-scroll-hint-${project.id}`}
              className={`projects-mobile-scroll-hint-dot ${index === 0 ? "is-active" : ""}`}
            />
          ))}
        </div>
      </section>

      <section id="contact" className="panel panel-contact">
        <div className="contact-content">
          <h2 data-reveal data-reveal-order="0">{t("home.contact.title")}</h2>
          {contactParagraphs.map((paragraph, index) => (
            <p key={`contact-${index}`} data-reveal data-reveal-order={index + 1}>
              {paragraph}
            </p>
          ))}
          <p data-reveal data-reveal-order={contactParagraphs.length + 1}>
            Per numero di telefono, CV completo o qualsiasi altra informazione usare il form
            accanto.
          </p>
          <div className="contact-actions" data-reveal data-reveal-order={contactParagraphs.length + 2}>
            <a
              className="contact-action-btn"
              href={SITE_CONFIG.linkedInUrl}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a className="contact-action-btn" href={cvPdf} target="_blank" rel="noreferrer">
              CV
            </a>
          </div>
        </div>
        <div className="contact-right">
          <div
            className="contact-form-card"
            data-reveal="card"
            data-reveal-order={contactParagraphs.length + 3}
          >
            <form action={SITE_CONFIG.contactFormAction} method="POST">
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

      <button
        type="button"
        className={`home-back-to-top ${showHomeBackToTop ? "is-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={t("home.backToTopAria")}
      >
        <img src={backToTopIcon} alt="" aria-hidden="true" />
      </button>
    </>
  );
}
