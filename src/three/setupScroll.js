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
  const projectEntryRotY = baseRotY + Math.PI * 0.25;
  const basePosX = model.position.x;

  gsap.set(model.rotation, { y: baseRotY });
  gsap.set(model.position, { x: basePosX });

  const firstPanel = document.querySelector(".panel:nth-of-type(1)");
  const heroSection = document.querySelector(".hero");
  const aboutSection = document.querySelector(".panel-skills");
  const footer = document.querySelector(".site-footer");

  const aboutShiftTween = gsap.fromTo(
    model.position,
    { x: basePosX },
    {
      x: basePosX + sizeScaled.x * 0.35,
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: aboutSection || ".panel-skills",
        start: "top bottom",
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true
      }
    }
  );

  const aboutRotateTween = gsap.fromTo(
    model.rotation,
    { y: baseRotY },
    {
      y: projectEntryRotY,
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: aboutSection || ".panel-skills",
        start: "top bottom",
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true
      }
    }
  );

  const camStartY = camera.position.y;
  const camEndY = camStartY - sizeScaled.y * 0.8;
  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  const scrollState = {
    startScroll: 0,
    endScroll: 0,
    movingScroll: 1
  };

  const refreshCameraRanges = () => {
    const viewportH = window.innerHeight || 1;
    const startScroll = aboutSection
      ? Math.max(aboutSection.offsetTop, 0)
      : heroSection
        ? heroSection.offsetTop + heroSection.offsetHeight
        : (firstPanel ? firstPanel.offsetTop + firstPanel.offsetHeight : 0);

    const maxScroll = ScrollTrigger.maxScroll(window);
    const pageEnd = footer
      ? Math.max(footer.offsetTop + footer.offsetHeight - viewportH, 0)
      : maxScroll;

    const endScroll = Math.max(pageEnd, startScroll + viewportH * 0.8);
    const movingScroll = Math.max(endScroll - startScroll, 1);

    scrollState.startScroll = startScroll;
    scrollState.endScroll = endScroll;
    scrollState.movingScroll = movingScroll;
  };

  const updateCameraByScroll = (scrollPos) => {
    const s = scrollPos;
    const { startScroll, movingScroll } = scrollState;
    const progress = clamp01((s - startScroll) / movingScroll);
    camera.position.y = camStartY + (camEndY - camStartY) * progress;
  };

  refreshCameraRanges();

  const camScrollTrigger = ScrollTrigger.create({
    start: 0,
    end: "max",
    scrub: 0.35,
    invalidateOnRefresh: true,
    onRefreshInit: refreshCameraRanges,
    onRefresh: (self) => updateCameraByScroll(self.scroll()),
    onUpdate: (self) => updateCameraByScroll(self.scroll())
  });

  ScrollTrigger.refresh();
  ScrollTrigger.update();

    return {
      kill: () => {
      aboutShiftTween.scrollTrigger?.kill?.();
      aboutShiftTween.kill?.();
      aboutRotateTween.scrollTrigger?.kill?.();
      aboutRotateTween.kill?.();
      camScrollTrigger.kill?.();
    }
  };
}
