import {
  HOME_MEDIA_QUERIES,
  HOME_PERFORMANCE_SETTINGS,
  HOME_PROJECTS_TOUCH_SETTINGS,
  HOME_PROJECT_TIP_MODES
} from "../../config/homePage.config";

export const isLowEndMobileDevice = () => {
  if (typeof window === "undefined") return false;
  if (!window.matchMedia(HOME_MEDIA_QUERIES.mobile).matches) return false;

  const prefersReducedMotion = window.matchMedia(HOME_MEDIA_QUERIES.reducedMotion).matches;
  const cpuCores =
    navigator.hardwareConcurrency ?? HOME_PERFORMANCE_SETTINGS.fallbackCpuCores;
  const memoryGb = navigator.deviceMemory ?? HOME_PERFORMANCE_SETTINGS.fallbackMemoryGb;

  return (
    prefersReducedMotion ||
    cpuCores <= HOME_PERFORMANCE_SETTINGS.lowEndCpuCores ||
    memoryGb <= HOME_PERFORMANCE_SETTINGS.lowEndMemoryGb
  );
};

// Collect media assets used to populate project cards.
export const collectProjectMediaSources = (blocks = []) =>
  blocks.flatMap((block) => {
    if (block.type === "image" && block.src) return [block.src];
    if (block.type === "gallery" && block.images?.length) {
      return block.images.map((img) => img.src).filter(Boolean);
    }
    if (block.type === "split" && block.media?.src) return [block.media.src];
    return [];
  });

export const getProjectSlideMedia = (project) => {
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

export const getProjectsTouchTipMode = ({ isMobile, projectsHorizontal }) => {
  if (!isMobile || !projectsHorizontal) return HOME_PROJECT_TIP_MODES.swipe;

  const firstSlide = projectsHorizontal.querySelector(".project-slide");
  const hideThreshold = firstSlide
    ? Math.max(
        firstSlide.clientWidth * HOME_PROJECTS_TOUCH_SETTINGS.hideThresholdRatio,
        HOME_PROJECTS_TOUCH_SETTINGS.hideThresholdMinPx
      )
    : HOME_PROJECTS_TOUCH_SETTINGS.hideThresholdMinPx;

  const maxScrollLeft = Math.max(
    projectsHorizontal.scrollWidth - projectsHorizontal.clientWidth,
    0
  );
  const endThreshold = Math.max(
    maxScrollLeft - HOME_PROJECTS_TOUCH_SETTINGS.endThresholdOffsetPx,
    hideThreshold + 1
  );

  if (maxScrollLeft > 0 && projectsHorizontal.scrollLeft >= endThreshold) {
    return HOME_PROJECT_TIP_MODES.down;
  }

  if (projectsHorizontal.scrollLeft > hideThreshold) {
    return HOME_PROJECT_TIP_MODES.hidden;
  }

  return HOME_PROJECT_TIP_MODES.swipe;
};
