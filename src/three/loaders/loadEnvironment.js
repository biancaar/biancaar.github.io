import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export function loadEnvironment({ scene, pmrem, hdrPath, intensity }) {
  let envMap = null;

  return new Promise((resolve, reject) => {
    const loader = new RGBELoader();
    loader.load(
      hdrPath,
      (hdrTex) => {
        envMap = pmrem.fromEquirectangular(hdrTex).texture;
        scene.environment = envMap;
        scene.environmentIntensity = intensity;
        hdrTex.dispose();
        resolve({
          envMap,
          dispose: () => envMap?.dispose?.()
        });
      },
      undefined,
      (err) => reject(err)
    );
  });
}
