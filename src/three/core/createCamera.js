import * as THREE from "three";

export function createCamera({ fov, aspect, near, far, initialPosition }) {
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(...initialPosition);
  return camera;
}
