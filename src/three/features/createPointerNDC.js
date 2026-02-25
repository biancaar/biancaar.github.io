import * as THREE from "three";

export function createPointerNDC(rendererDom) {
  const ndc = new THREE.Vector2(0, 0);

  const onMouseMove = (e) => {
    const rect = rendererDom.getBoundingClientRect();
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  window.addEventListener("mousemove", onMouseMove, { passive: true });

  return {
    ndc,
    dispose: () => window.removeEventListener("mousemove", onMouseMove)
  };
}
