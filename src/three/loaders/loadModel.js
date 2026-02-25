import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function loadModel({
  sceneGroup,
  glbPath,
  modelConfig
}) {
  const heightTex = new THREE.TextureLoader().load(modelConfig.heightMapPath);
  heightTex.colorSpace = THREE.NoColorSpace;
  heightTex.flipY = false;
  heightTex.wrapS = heightTex.wrapT = THREE.ClampToEdgeWrapping;

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      glbPath,
      (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = modelConfig.targetScale / maxDim;
        model.scale.setScalar(scale);

        model.position.y += modelConfig.positionOffset.y;
        model.position.z += modelConfig.positionOffset.z;

        sceneGroup.add(model);

        model.traverse((child) => {
          if (!child.isMesh) return;

          child.castShadow = true;
          child.receiveShadow = true;

          const geo = child.geometry;
          if (geo && geo.attributes.uv && !geo.attributes.uv2) {
            geo.setAttribute(
              "uv2",
              new THREE.BufferAttribute(geo.attributes.uv.array, 2)
            );
          }

          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((mat) => {
            if (!mat) return;

            if (mat.normalMap && mat.normalScale) {
              mat.normalScale.set(modelConfig.normalScale, modelConfig.normalScale);
            }

            if (!mat.displacementMap) {
              mat.displacementMap = heightTex;
              mat.displacementScale = modelConfig.displacementScale;
              mat.displacementBias = modelConfig.displacementBias;
            }

            mat.needsUpdate = true;
          });
        });

        const boxScaled = new THREE.Box3().setFromObject(model);
        const sizeScaled = boxScaled.getSize(new THREE.Vector3());
        const centerScaled = boxScaled.getCenter(new THREE.Vector3());

        resolve({
          model,
          sizeScaled,
          centerScaled,
          dispose: () => heightTex?.dispose?.()
        });
      },
      undefined,
      (err) => reject(err)
    );
  });
}
