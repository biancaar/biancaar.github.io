/** Camera, lighting and assets for the hero's real-time artwork. */
export const column = {
  model: '/media/column-optimized.glb',
  fallback: '/media/column-lit-desktop.png',
  alt: 'Corinthian column modeled in Blender by Bianca Rotaru',
  camera: { fov: 32, desktopY: 3.4, compactY: 3.6, desktopZ: 10, compactZ: 11 },
  lights: {
    ambient: { color: 0xb3bfd8, intensity: .065 },
    fill: { color: 0xffe5cc, intensity: .22 },
    warmRim: { color: 0xff8c50, intensity: 5.8 },
    coolRim: { color: 0x799fef, intensity: 2.7 },
    cursor: { color: 0xffdfb5, intensity: 38 },
  },
};
