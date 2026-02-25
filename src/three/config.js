export const THREE_CONFIG = {
  camera: {
    fov: 45,
    near: 0.03,
    far: 100,
    initialPosition: [0, 0, 3]
  },

  renderer: {
    toneMappingExposure: 0.3
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
    ambient: { color: 0x070a10, intensity: 0.02 },

    blueRim: {
      color: 0x2b7bff,
      intensity: 150,
      distance: 5,
      angle: Math.PI / 4,
      penumbra: 0.55,
      decay: 1,
      position: [-5.5, 5.8, -0.2]
    },

    redRim: {
      color: 0xff762b,
      intensity: 188,
      distance: 5,
      angle: Math.PI / 4,
      penumbra: 0.18,
      decay: 1,
      position: [5.2, 2.4, -0.8]
    },

    frontKey: {
      color: 0xfde4bd,
      intensity: 20,
      distance: 70,
      angle: Math.PI / 10,
      penumbra: 0.5,
      decay: 2.0,
      position: [1.0, 2.0, 2.5]
    },

    extraRim: {
      color: 0xffa200,
      intensity: 10,
      distance: 10,
      angle: Math.PI / 2,
      penumbra: 0.18,
      decay: 2.4,
      position: [1, 2.4, 2.8]
    },

    whiteRim: {
      color: 0xffffff,
      intensity: 100,
      distance: 10,
      angle: Math.PI / 2,
      penumbra: 0.18,
      decay: 2.4,
      position: [0, 7, 6]
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
      distance: 5,
      decay: 2,
      angle: Math.PI / 6.5,
      penumbra: 0.85,
      mapSize: [4096, 4096],
      near: 1.0,
      far: 20.0,
      bias: -0.00015,
      normalBias: 0.004
    }
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
