import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function setupScroll({ model, camera, sizeScaled, centerScaled }) {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);
    registered = true;
  }

  const baseRotY = 0;
  const preAboutRotY = baseRotY + Math.PI * 0.03;
  const projectEntryRotY = baseRotY + Math.PI * 0.25;
  const basePosX = model.position.x;

  gsap.set(model.rotation, { y: baseRotY });
  gsap.set(model.position, { x: basePosX });

  const firstPanel = document.querySelector(".panel:nth-of-type(1)");
  const heroSection = document.querySelector(".hero");
  const aboutSpacerSection = document.querySelector(".panel-about-spacer");
  const aboutSection = document.querySelector(".panel-skills");
  const projectsSection = document.querySelector(".panel-projects");
  const footer = document.querySelector(".site-footer");
  const hasVisibleHeight = (el) => !!el && el.offsetHeight > 4;
  const aboutMotionTrigger = hasVisibleHeight(aboutSpacerSection)
    ? aboutSpacerSection
    : aboutSection;
  const aboutMotionEnd = aboutMotionTrigger === aboutSpacerSection
    ? "bottom top"
    : "top top";
  const rotateMotionTrigger = aboutSection || aboutMotionTrigger || ".panel-skills";

  const aboutShiftTween = gsap.fromTo(
    model.position,
    { x: basePosX },
    {
      x: () =>
        basePosX +
        sizeScaled.x *
          (window.matchMedia("(orientation: landscape)").matches ? 0.5 : 0.35),
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: aboutMotionTrigger || ".panel-skills",
        start: "top bottom",
        end: aboutMotionEnd,
        scrub: true,
        invalidateOnRefresh: true
      }
    }
  );

  const aboutRotateProbe = ScrollTrigger.create({
    trigger: rotateMotionTrigger,
    start: "bottom bottom",
    end: "bottom top",
    invalidateOnRefresh: true
  });

  const camStartY = camera.position.y;
  const camEndY = camStartY - sizeScaled.y * 0.8;
  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  const scrollState = {
    startScroll: 0,
    endScroll: 0,
    movingScroll: 1
  };

  const rotationState = {
    heroStartScroll: 0,
    aboutStartScroll: 0,
    aboutEndScroll: 1
  };

  // Probe trigger used only to read the effective scroll position where
  // the Projects section enters (accounts for pin spacing in previous sections).
  const projectsEntryProbe = projectsSection
    ? ScrollTrigger.create({
        trigger: projectsSection,
        start: "top top",
        end: "top top",
        invalidateOnRefresh: true
      })
    : null;

  const refreshCameraRanges = () => {
    const viewportH = window.innerHeight || 1;
    const fallbackStartScroll = aboutMotionTrigger
      ? Math.max(aboutMotionTrigger.offsetTop, 0)
      : heroSection
        ? heroSection.offsetTop + heroSection.offsetHeight
        : (firstPanel ? firstPanel.offsetTop + firstPanel.offsetHeight : 0);

    const projectsEntryScroll =
      projectsEntryProbe && Number.isFinite(projectsEntryProbe.start)
        ? projectsEntryProbe.start
        : null;

    // Start descending in the transition Timeline -> Projects.
    const startScroll = projectsEntryScroll !== null
      ? Math.max(projectsEntryScroll - viewportH * 1.0, 0)
      : fallbackStartScroll;

    const maxScroll = ScrollTrigger.maxScroll(window);
    const pageEnd = footer
      ? Math.max(footer.offsetTop + footer.offsetHeight - viewportH, 0)
      : maxScroll;

    const endScroll = Math.max(pageEnd, startScroll + viewportH * 0.8);
    const movingScroll = Math.max(endScroll - startScroll, 1);

    const aboutStartScroll = Number.isFinite(aboutRotateProbe.start)
      ? aboutRotateProbe.start
      : 0;
    const aboutEndScroll = Number.isFinite(aboutRotateProbe.end)
      ? aboutRotateProbe.end
      : aboutStartScroll + 1;
    const heroStartScroll = heroSection ? Math.max(heroSection.offsetTop, 0) : 0;

    scrollState.startScroll = startScroll;
    scrollState.endScroll = endScroll;
    scrollState.movingScroll = movingScroll;
    rotationState.heroStartScroll = heroStartScroll;
    rotationState.aboutStartScroll = aboutStartScroll;
    rotationState.aboutEndScroll = Math.max(aboutEndScroll, aboutStartScroll + 1);
  };

  const updateCameraByScroll = (scrollPos) => {
    const s = scrollPos;
    const { startScroll, movingScroll } = scrollState;
    const progress = clamp01((s - startScroll) / movingScroll);
    camera.position.y = camStartY + (camEndY - camStartY) * progress;
  };

  const updateRotationByScroll = (scrollPos) => {
    const s = scrollPos;
    const { heroStartScroll, aboutStartScroll, aboutEndScroll } = rotationState;

    if (s <= aboutStartScroll) {
      const phase = clamp01((s - heroStartScroll) / Math.max(aboutStartScroll - heroStartScroll, 1));
      model.rotation.y = baseRotY + (preAboutRotY - baseRotY) * phase;
      return;
    }

    if (s <= aboutEndScroll) {
      const phase = clamp01((s - aboutStartScroll) / Math.max(aboutEndScroll - aboutStartScroll, 1));
      model.rotation.y = preAboutRotY + (projectEntryRotY - preAboutRotY) * phase;
      return;
    }

    // Freeze rotation once Timeline is reached.
    model.rotation.y = projectEntryRotY;
  };

  refreshCameraRanges();

  const camScrollTrigger = ScrollTrigger.create({
    start: 0,
    end: "max",
    scrub: 0.35,
    invalidateOnRefresh: true,
    onRefreshInit: refreshCameraRanges,
    onRefresh: (self) => {
      updateCameraByScroll(self.scroll());
      updateRotationByScroll(self.scroll());
    },
    onUpdate: (self) => {
      updateCameraByScroll(self.scroll());
      updateRotationByScroll(self.scroll());
    }
  });

  ScrollTrigger.refresh();
  ScrollTrigger.update();

    return {
      kill: () => {
      aboutShiftTween.scrollTrigger?.kill?.();
      aboutShiftTween.kill?.();
      aboutRotateProbe.kill?.();
      projectsEntryProbe?.kill?.();
      camScrollTrigger.kill?.();
    }
  };
}
