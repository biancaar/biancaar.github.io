import * as THREE from "three";

const NOOP_LAYER = Object.freeze({
  update: () => {},
  dispose: () => {}
});

const pick = (isMobile, desktopValue, mobileValue) =>
  isMobile ? mobileValue : desktopValue;

const toVector3 = (arr, fallback = [0, 0, 0]) => {
  const source = Array.isArray(arr) && arr.length === 3 ? arr : fallback;
  return new THREE.Vector3(source[0], source[1], source[2]);
};

const randomBetween = (min, max) => min + Math.random() * (max - min);

export function addNebulaLayer(scene, options = {}) {
  const {
    config = {},
    camera = null,
    isMobile = false,
    reducedMotion = false,
    anchor = new THREE.Vector3()
  } = options;

  if (!scene) return NOOP_LAYER;

  const planeCount = Math.max(0, pick(isMobile, config.planesDesktop, config.planesMobile) ?? 0);
  if (!planeCount) return NOOP_LAYER;

  const center = anchor.clone().add(toVector3(config.centerOffset, [0, 0.9, -6.5]));
  const spread = config.spread ?? [4.2, 2.2, 2.0];
  const scaleRange = pick(isMobile, config.scaleDesktop, config.scaleMobile) ?? [5.5, 8.5];
  const opacityRange = pick(isMobile, config.opacityDesktop, config.opacityMobile) ?? [0.12, 0.2];
  const amplitudeBase = pick(
    isMobile,
    config.driftAmplitudeDesktop,
    config.driftAmplitudeMobile
  ) ?? 0.12;
  const driftSpeed = config.driftSpeed ?? 0.12;
  const rotationSpeed = config.rotationSpeed ?? 0.05;
  const color = new THREE.Color(config.color ?? 0xa8bbff);
  const blending = config.additive ? THREE.AdditiveBlending : THREE.NormalBlending;

  const group = new THREE.Group();
  group.renderOrder = -3;
  scene.add(group);

  const loader = new THREE.TextureLoader();
  const texturePaths = Array.isArray(config.texturePaths) ? config.texturePaths : [];
  const loadedTextures = [];
  const planes = [];
  const states = [];

  for (let i = 0; i < planeCount; i += 1) {
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: randomBetween(opacityRange[0], opacityRange[1]),
      depthWrite: false,
      depthTest: true,
      blending
    });

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    const mesh = new THREE.Mesh(geometry, material);

    const scale = randomBetween(scaleRange[0], scaleRange[1]);
    mesh.scale.set(scale, scale, 1);

    mesh.position.set(
      center.x + (Math.random() * 2 - 1) * spread[0] * 0.5,
      center.y + (Math.random() * 2 - 1) * spread[1] * 0.5,
      center.z + (Math.random() * 2 - 1) * spread[2] * 0.5
    );

    mesh.rotation.z = Math.random() * Math.PI * 2;
    group.add(mesh);
    planes.push(mesh);

    states.push({
      basePosition: mesh.position.clone(),
      phase: Math.random() * Math.PI * 2,
      driftAmplitude: amplitudeBase * randomBetween(0.7, 1.2),
      driftXFactor: randomBetween(0.2, 0.5),
      rotationDirection: Math.random() > 0.5 ? 1 : -1
    });

    const texturePath = texturePaths[i % Math.max(texturePaths.length, 1)];
    if (texturePath) {
      loader.load(
        texturePath,
        (texture) => {
          loadedTextures.push(texture);
          material.map = texture;
          material.needsUpdate = true;
        },
        undefined,
        () => {
          // Optional texture: keep fallback translucent color.
        }
      );
    }
  }

  let elapsed = 0;
  const update = (dt) => {
    if (!Number.isFinite(dt) || dt <= 0) return;
    elapsed += dt;

    for (let i = 0; i < planes.length; i += 1) {
      const mesh = planes[i];
      const state = states[i];

      if (!reducedMotion) {
        const phase = elapsed * driftSpeed + state.phase;
        mesh.position.y = state.basePosition.y + Math.sin(phase) * state.driftAmplitude;
        mesh.position.x = state.basePosition.x + Math.cos(phase * 0.7) * state.driftAmplitude * state.driftXFactor;
        mesh.rotation.z += state.rotationDirection * rotationSpeed * dt;
      }

      if (camera) {
        mesh.lookAt(camera.position);
      }
    }
  };

  const dispose = () => {
    scene.remove(group);

    for (const mesh of planes) {
      mesh.geometry?.dispose?.();
      mesh.material?.dispose?.();
    }

    for (const texture of loadedTextures) {
      texture?.dispose?.();
    }
  };

  return { update, dispose };
}

