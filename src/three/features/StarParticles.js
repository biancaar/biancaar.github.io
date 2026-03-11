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

export function addStarParticles(scene, options = {}) {
  const {
    config = {},
    isMobile = false,
    reducedMotion = false,
    anchor = new THREE.Vector3()
  } = options;

  if (!scene) return NOOP_LAYER;

  const count = Math.max(0, pick(isMobile, config.countDesktop, config.countMobile) ?? 0);
  if (!count) return NOOP_LAYER;

  const area = pick(isMobile, config.areaDesktop, config.areaMobile) ?? [12, 8, 10];
  const center = anchor.clone().add(toVector3(config.centerOffset, [0, 1, -8]));

  const size = pick(isMobile, config.sizeDesktop, config.sizeMobile) ?? 0.04;
  const opacity = pick(isMobile, config.opacityDesktop, config.opacityMobile) ?? 0.2;
  const driftY = config.driftY ?? 0.01;
  const driftZ = config.driftZ ?? 0.008;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const velocityY = new Float32Array(count);
  const velocityZ = new Float32Array(count);

  const colorA = new THREE.Color(config.colorA ?? 0xffffff);
  const colorB = new THREE.Color(config.colorB ?? 0xa9bfff);
  const mixed = new THREE.Color();

  const halfX = area[0] * 0.5;
  const halfY = area[1] * 0.5;
  const halfZ = area[2] * 0.5;
  const minY = center.y - halfY;
  const maxY = center.y + halfY;
  const minZ = center.z - halfZ;
  const maxZ = center.z + halfZ;

  for (let i = 0; i < count; i += 1) {
    const idx = i * 3;
    positions[idx + 0] = center.x + (Math.random() * 2 - 1) * halfX;
    positions[idx + 1] = center.y + (Math.random() * 2 - 1) * halfY;
    positions[idx + 2] = center.z + (Math.random() * 2 - 1) * halfZ;

    const t = Math.random();
    mixed.copy(colorA).lerp(colorB, t);
    colors[idx + 0] = mixed.r;
    colors[idx + 1] = mixed.g;
    colors[idx + 2] = mixed.b;

    velocityY[i] = driftY * (0.35 + Math.random() * 0.65);
    velocityZ[i] = driftZ * (Math.random() > 0.5 ? 1 : -1) * (0.35 + Math.random() * 0.65);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size,
    transparent: true,
    opacity,
    vertexColors: true,
    depthWrite: false,
    depthTest: true,
    blending: config.additive === false ? THREE.NormalBlending : THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.renderOrder = -2;
  scene.add(points);

  const positionAttr = geometry.getAttribute("position");

  const update = (dt) => {
    if (reducedMotion) return;
    if (!Number.isFinite(dt) || dt <= 0) return;

    const p = positionAttr.array;
    for (let i = 0; i < count; i += 1) {
      const idx = i * 3;

      p[idx + 1] += velocityY[i] * dt;
      p[idx + 2] += velocityZ[i] * dt;

      if (p[idx + 1] > maxY) p[idx + 1] = minY;
      if (p[idx + 1] < minY) p[idx + 1] = maxY;
      if (p[idx + 2] > maxZ) p[idx + 2] = minZ;
      if (p[idx + 2] < minZ) p[idx + 2] = maxZ;
    }

    positionAttr.needsUpdate = true;
  };

  const dispose = () => {
    scene.remove(points);
    geometry.dispose();
    material.dispose();
  };

  return { update, dispose };
}

