import * as THREE from "three";

export function createMouseLight({ scene, camera, config }) {
  const mouseTarget = new THREE.Object3D();
  scene.add(mouseTarget);

  const mouseLight = new THREE.SpotLight(
    config.color,
    config.intensity,
    config.distance,
    config.angle,
    config.penumbra,
    config.decay
  );

  mouseLight.castShadow = false;
  mouseLight.position.set(...config.initialPosition);
  mouseLight.target = mouseTarget;
  scene.add(mouseLight);

  const raycaster = new THREE.Raycaster();
  const hitPoint = new THREE.Vector3();
  const desiredLightPos = new THREE.Vector3();
  const desiredTargetPos = new THREE.Vector3();

  const mousePlane = new THREE.Plane();
  const planeNormal = new THREE.Vector3();

  const update = ({ ndc, heroCenter }) => {
    camera.getWorldDirection(planeNormal).multiplyScalar(-1);
    mousePlane.setFromNormalAndCoplanarPoint(planeNormal, heroCenter);

    raycaster.setFromCamera(ndc, camera);
    const hasHit = raycaster.ray.intersectPlane(mousePlane, hitPoint);

    if (hasHit) {
      desiredTargetPos.copy(hitPoint);
      desiredLightPos.copy(hitPoint).add(new THREE.Vector3(0, 0.9, 1.6));

      mouseTarget.position.lerp(desiredTargetPos, 0.18);
      mouseLight.position.lerp(desiredLightPos, 0.12);
    }
  };

  return {
    update,
    dispose: () => {
      scene.remove(mouseTarget);
      scene.remove(mouseLight);
    }
  };
}
