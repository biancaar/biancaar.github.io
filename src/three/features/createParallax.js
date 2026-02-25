import * as THREE from "three";

export function createParallax({ heroGroup, config }) {
  const basePos = new THREE.Vector3();
  const baseRot = new THREE.Euler();

  const posTarget = new THREE.Vector3();
  const posCurrent = new THREE.Vector3();
  const rotTarget = new THREE.Euler();
  const rotCurrent = new THREE.Euler();

  const setBase = () => {
    basePos.copy(heroGroup.position);
    baseRot.copy(heroGroup.rotation);
  };

  const update = ({ ndc }) => {
    const invX = -ndc.x;
    const invY = -ndc.y;

    posTarget.set(
      basePos.x + invX * config.posAmountX,
      basePos.y + invY * config.posAmountY,
      basePos.z
    );

    rotTarget.set(
      baseRot.x + invY * config.rotAmountX,
      baseRot.y + invX * config.rotAmountY,
      baseRot.z
    );

    posCurrent.lerp(posTarget, config.lerp);
    heroGroup.position.copy(posCurrent);

    rotCurrent.x = THREE.MathUtils.lerp(rotCurrent.x, rotTarget.x, config.lerp);
    rotCurrent.y = THREE.MathUtils.lerp(rotCurrent.y, rotTarget.y, config.lerp);
    rotCurrent.z = THREE.MathUtils.lerp(rotCurrent.z, rotTarget.z, config.lerp);

    heroGroup.rotation.set(rotCurrent.x, rotCurrent.y, rotCurrent.z);
  };

  return { setBase, update };
}
