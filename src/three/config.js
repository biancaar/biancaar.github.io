export const THREE_CONFIG = {
  quality: {
    mobileBreakpoint: 768,
    dprThreshold: 1.5
  },

  camera: {
    fov: 45,
    near: 0.03,
    far: 100,
    initialPosition: [0, 0, 3]
  },

  renderer: {
    // Tune here: global cinematic exposure.
    toneMappingExposure: 0.38
  },

  env: {
    hdrPath: "/env/venice_sunset_4k.hdr",
    intensity: 0.5
  },

  parallax: {
    posAmountX: 0.001,
    posAmountY: 0.0006,
    rotAmountX: 0.006,
    rotAmountY: 0.1,
    lerp: 0.1
  },

  lights: {
    ambient: { color: 0x070a10, intensity: 0.012 },

    // Tune here: cold rim edge highlight.
    blueRim: {
      color: 0x4d86ff,
      intensity: 170,
      distance: 22,
      angle: Math.PI / 5.4,
      penumbra: 0.6,
      decay: 1.7,
      position: [-4.6, 4.7, -2.6]
    },

    // Tune here: keep subtle red accent or disable on mobile.
    redRim: {
      color: 0xff7040,
      intensity: 26,
      distance: 16,
      angle: Math.PI / 4.5,
      penumbra: 0.35,
      decay: 1.8,
      position: [3.6, 2.2, -1.8],
      disableOnMobile: true
    },

    // Tune here: warm directional key for sculpt detail.
    frontKey: {
      color: 0xffd6a6,
      intensity: 38,
      distance: 18,
      angle: Math.PI / 11,
      penumbra: 0.42,
      decay: 1.85,
      position: [1.35, 2.45, 2.35]
    },

    extraRim: {
      color: 0x9db7ff,
      intensity: 18,
      distance: 14,
      angle: Math.PI / 3.8,
      penumbra: 0.5,
      decay: 1.8,
      position: [2.2, 2.7, 1.4]
    },

    whiteRim: {
      color: 0xffffff,
      intensity: 22,
      distance: 18,
      angle: Math.PI / 3.5,
      penumbra: 0.55,
      decay: 1.85,
      position: [0.1, 4.9, 3.8]
    },

    mouseLight: {
      color: 0xffffff,
      intensity: 10,
      distance: 12,
      angle: Math.PI / 28,
      penumbra: 0.85,
      decay: 2.0,
      initialPosition: [0, 2, 3]
    }
  },

  shadows: {
    enabled: true,
    type: "PCFSoft",
    frontKey: {
      castShadow: true,
      distance: 18,
      decay: 1.85,
      angle: Math.PI / 11,
      penumbra: 0.42,
      mapSizeDesktop: [1024, 1024],
      mapSizeMobile: [512, 512],
      near: 0.35,
      far: 22.0,
      bias: -0.00022,
      normalBias: 0.012
    },
    whiteRim: {
      castShadowDesktop: true,
      castShadowMobile: false,
      mapSizeDesktop: [768, 768],
      mapSizeMobile: [256, 256],
      near: 0.35,
      far: 18.0,
      bias: -0.00012,
      normalBias: 0.01
    }
  },

  stars: {
    countDesktop: 1800,
    countMobile: 800,
    areaDesktop: [16, 10, 14],
    areaMobile: [12, 8, 11],
    centerOffset: [0, 1.2, -8.4],
    sizeDesktop: 0.04,
    sizeMobile: 0.055,
    opacityDesktop: 0.22,
    opacityMobile: 0.14,
    colorA: 0xf5f8ff,
    colorB: 0x9eb8ff,
    driftY: 0.012,
    driftZ: 0.008,
    additive: true
  },

  nebula: {
    texturePaths: [
      "/textures/smoke/smoke_01.png",
      "/textures/smoke/smoke_02.png",
      "/textures/smoke/smoke_03.png",
      "/textures/smoke/smoke_04.png"
    ],
    planesDesktop: 4,
    planesMobile: 2,
    centerOffset: [0, 0.95, -6.8],
    spread: [4.4, 2.3, 1.9],
    scaleDesktop: [6.6, 10.2],
    scaleMobile: [4.4, 6.4],
    opacityDesktop: [0.12, 0.22],
    opacityMobile: [0.08, 0.13],
    driftAmplitudeDesktop: 0.16,
    driftAmplitudeMobile: 0.08,
    driftSpeed: 0.13,
    rotationSpeed: 0.05,
    color: 0xffffff,
    additive: false
  },

  model: {
    glbPath: "/models/Column.glb",
    heightMapPath: "/textures/mat/ColumnHeightMap.png",
    displacementScale: 0.01,
    displacementBias: 0.0,
    normalScale: 1.0,
    targetScale: 1.5,
    positionOffset: { y: -0.05, z: 0.03 }
  },

  godray: {
    position: [1.1, 0.65, -1.4],
    direction: [-0.55, -0.22, -1.0],
    len: 2.2,
    cylinder: {
      top: 0.003,
      bottom: 1,
      radialSegments: 48,
      heightSegments: 1,
      openEnded: true
    },
    uniforms: {
      uIntensity: 0.25,
      uEdgeSoft: 4.4,
      uDensity: 1.05,
      uNoiseScale: 4.4,
      uNoiseSpeed: 0.18
    },
    dust: {
      count: 200,
      uSize: 2.2,
      uAlpha: 0.35
    },
    beamLight: {
      intensity: 70,
      distance: 20,
      angle: Math.PI / 10,
      penumbra: 0.85,
      decay: 2.0,
      targetPosition: [0.0, 0.05, -3.0]
    }
  }
};
