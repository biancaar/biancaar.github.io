import timelineIconEducation from "../assets/cast_for_education_40dp_FFFFFF_FILL0_wght400_GRAD0_opsz40.png";
import timelineIconSchool from "../assets/school_40dp_FFFFFF_FILL0_wght400_GRAD0_opsz40.png";
import timelineIconAssignment from "../assets/assignment_40dp_FFFFFF_FILL0_wght400_GRAD0_opsz40.png";
import timelineIconLicense from "../assets/license_40dp_FFFFFF_FILL0_wght400_GRAD0_opsz40.png";

export const HOME_MEDIA_QUERIES = {
  desktop: "(orientation: landscape)",
  mobile: "(orientation: portrait)",
  reducedMotion: "(prefers-reduced-motion: reduce)"
};

export const HOME_REVEAL_SETTINGS = {
  selector: "[data-reveal]",
  threshold: 0.15,
  rootMargin: "0px 0px -10% 0px",
  stagger: 0.1,
  once: true
};

export const HOME_PROJECT_TIP_MODES = {
  swipe: "swipe",
  hidden: "hidden",
  down: "down"
};

export const HOME_PROJECTS_TOUCH_SETTINGS = {
  hideThresholdRatio: 0.12,
  hideThresholdMinPx: 24,
  endThresholdOffsetPx: 24
};

export const HOME_BACK_TO_TOP_SETTINGS = {
  desktopMinWidth: 1024,
  thresholdViewportMultiplier: 1.1
};

export const HOME_PERFORMANCE_SETTINGS = {
  fallbackCpuCores: 8,
  fallbackMemoryGb: 8,
  lowEndCpuCores: 4,
  lowEndMemoryGb: 4
};

export const HOME_TIMELINE_SETTINGS = {
  desktopTravelExtraPx: 10,
  desktopMinPinViewportFactor: 0.9,
  mobileStart: "top 80%",
  mobileEnd: "bottom 25%",
  mobileScrub: 0.8
};

export const HOME_PROJECTS_SCROLL_SETTINGS = {
  desktop: {
    pinExtraFactor: 0.22,
    minPinDistanceViewportFactor: 0.9,
    scrub: 1,
    anticipatePin: 1,
    refreshPriority: 1
  }
};

export const HOME_HERO_PARALLAX_SETTINGS = {
  desktopY: 30,
  mobile: {
    lowEnd: {
      title: { y: 22, scale: 0.985, opacity: 0.96, scrub: 0.45 },
      subtitle: { y: 14, opacity: 0.96, scrub: 0.4 }
    },
    regular: {
      title: { y: 58, scale: 0.93, opacity: 0.84, scrub: 0.9 },
      subtitle: { y: 34, opacity: 0.82, scrub: 0.8 }
    }
  }
};

export const HOME_ABOUT_FOCUS_ITEMS = ["Three.js", "React", "UI/UX Design"];

export const HOME_TIMELINE_NODE_ICONS = [
  timelineIconEducation,
  timelineIconSchool,
  timelineIconAssignment,
  timelineIconLicense,
  timelineIconSchool
];
