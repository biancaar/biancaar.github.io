import { useEffect, useRef } from "react";
import * as THREE from "three";

import { THREE_CONFIG } from "../three/config";

import { createScene } from "../three/core/createScene";
import { createCamera } from "../three/core/createCamera";
import { createRenderer } from "../three/core/createRenderer";

import { loadEnvironment } from "../three/loaders/loadEnvironment";
import { loadModel } from "../three/loaders/loadModel";

import { createPointerNDC } from "../three/features/createPointerNDC";
import { createMouseLight } from "../three/features/createMouseLight";
import { createParallax } from "../three/features/createParallax";
import { createGodray } from "../three/features/createGodray";

import { setupScroll } from "../three/setupScroll";
import { safeDispose } from "../three/utils/dispose";

export default function ThreeScrollScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const disposables = [];
    let rafId = 0;
    let scrollHandle = null;

    const scene = createScene();

    const camera = createCamera({
      fov: THREE_CONFIG.camera.fov,
      aspect: window.innerWidth / window.innerHeight,
      near: THREE_CONFIG.camera.near,
      far: THREE_CONFIG.camera.far,
      initialPosition: THREE_CONFIG.camera.initialPosition
    });
    scene.add(camera);

    const { renderer, pmrem } = createRenderer({
      canvas,
      exposure: THREE_CONFIG.renderer.toneMappingExposure
    });
    disposables.push(pmrem);
    disposables.push(renderer);

    const clock = new THREE.Clock();

    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    const pointer = createPointerNDC(renderer.domElement);
    disposables.push(pointer);

    const mouseLight = createMouseLight({
      scene,
      camera,
      config: THREE_CONFIG.lights.mouseLight
    });

    const parallax = createParallax({
      heroGroup,
      config: THREE_CONFIG.parallax
    });

    const godray = createGodray({
      camera,
      config: THREE_CONFIG.godray
    });

    const heroCenter = new THREE.Vector3(0, 0.7, 0);

    const applyShadows = () => {
      const { frontKey } = THREE_CONFIG.lights;

      const front = scene.children.find(
        (o) => o.isSpotLight && o.color?.getHex?.() === frontKey.color
      );

      if (!front) return;

      front.castShadow = true;
      front.distance = THREE_CONFIG.shadows.frontKey.distance;
      front.decay = THREE_CONFIG.shadows.frontKey.decay;
      front.angle = THREE_CONFIG.shadows.frontKey.angle;
      front.penumbra = THREE_CONFIG.shadows.frontKey.penumbra;

      front.shadow.mapSize.set(...THREE_CONFIG.shadows.frontKey.mapSize);
      front.shadow.camera.near = THREE_CONFIG.shadows.frontKey.near;
      front.shadow.camera.far = THREE_CONFIG.shadows.frontKey.far;

      front.shadow.bias = THREE_CONFIG.shadows.frontKey.bias;
      front.shadow.normalBias = THREE_CONFIG.shadows.frontKey.normalBias;
    };

    const addBaseLights = () => {
      const L = THREE_CONFIG.lights;

      scene.add(new THREE.AmbientLight(L.ambient.color, L.ambient.intensity));

      const blue = new THREE.SpotLight(
        L.blueRim.color,
        L.blueRim.intensity,
        L.blueRim.distance,
        L.blueRim.angle,
        L.blueRim.penumbra,
        L.blueRim.decay
      );
      blue.position.set(...L.blueRim.position);
      scene.add(blue);

      const red = new THREE.SpotLight(
        L.redRim.color,
        L.redRim.intensity,
        L.redRim.distance,
        L.redRim.angle,
        L.redRim.penumbra,
        L.redRim.decay
      );
      red.position.set(...L.redRim.position);
      scene.add(red);

      const front = new THREE.SpotLight(
        L.frontKey.color,
        L.frontKey.intensity,
        L.frontKey.distance,
        L.frontKey.angle,
        L.frontKey.penumbra,
        L.frontKey.decay
      );
      front.position.set(...L.frontKey.position);
      scene.add(front);

      const extra = new THREE.SpotLight(
        L.extraRim.color,
        L.extraRim.intensity,
        L.extraRim.distance,
        L.extraRim.angle,
        L.extraRim.penumbra,
        L.extraRim.decay
      );
      extra.position.set(...L.extraRim.position);
      scene.add(extra);

      const white = new THREE.SpotLight(
        L.whiteRim.color,
        L.whiteRim.intensity,
        L.whiteRim.distance,
        L.whiteRim.angle,
        L.whiteRim.penumbra,
        L.whiteRim.decay
      );
      white.position.set(...L.whiteRim.position);
      white.castShadow = true;
      scene.add(white);

      front.castShadow = true;
      applyShadows();

      return { frontKey: front };
    };

    const { frontKey } = addBaseLights();

    const init = async () => {
      try {
        const env = await loadEnvironment({
          scene,
          pmrem,
          hdrPath: THREE_CONFIG.env.hdrPath,
          intensity: THREE_CONFIG.env.intensity
        });
        disposables.push(env);

        const loaded = await loadModel({
          sceneGroup: heroGroup,
          glbPath: THREE_CONFIG.model.glbPath,
          modelConfig: THREE_CONFIG.model
        });
        disposables.push(loaded);

        heroCenter.copy(loaded.centerScaled);

        parallax.setBase();

        const shadowKey = new THREE.DirectionalLight(0xffffff, 0.85);
        shadowKey.castShadow = true;
        shadowKey.position.set(1.0, 3.0, 10.5);
        scene.add(shadowKey);

        shadowKey.target.position.set(
          loaded.centerScaled.x,
          loaded.centerScaled.y,
          loaded.centerScaled.z
        );
        scene.add(shadowKey.target);

        shadowKey.shadow.mapSize.set(4096, 4096);

        const r = Math.max(loaded.sizeScaled.x, loaded.sizeScaled.y, loaded.sizeScaled.z) * 0.55;
        shadowKey.shadow.camera.left = -r;
        shadowKey.shadow.camera.right = r;
        shadowKey.shadow.camera.top = r;
        shadowKey.shadow.camera.bottom = -r;
        shadowKey.shadow.camera.near = 0.1;
        shadowKey.shadow.camera.far = r * 6;
        shadowKey.shadow.bias = -0.00015;
        shadowKey.shadow.normalBias = 0.006;

        const topY = loaded.centerScaled.y + loaded.sizeScaled.y * 0.5;
        const capitalY = topY - loaded.sizeScaled.y * 0.15;

        const fov = camera.fov * (Math.PI / 180);
        const cameraDistance = loaded.sizeScaled.y / (2 * Math.tan(fov / 2));

        const frameDown = loaded.sizeScaled.y * -0.04;
        const startYOffset = -0.02;
        const lookAtYOffset = 0.03;
        const isMobileViewport = window.matchMedia("(max-width: 900px)").matches;
        const heroDepthFactor = isMobileViewport ? 0.36 : 0.28;

        camera.position.set(
          loaded.centerScaled.x + loaded.sizeScaled.x * 0.12,
          capitalY - frameDown + startYOffset * loaded.sizeScaled.y,
          loaded.centerScaled.z + cameraDistance * heroDepthFactor
        );

        camera.lookAt(
          loaded.centerScaled.x,
          capitalY - frameDown + lookAtYOffset * loaded.sizeScaled.y,
          loaded.centerScaled.z
        );

        const keyTarget = new THREE.Object3D();
        keyTarget.position.set(loaded.centerScaled.x, capitalY, loaded.centerScaled.z);
        scene.add(keyTarget);
        frontKey.target = keyTarget;

        camera.near = Math.min(cameraDistance / 50, THREE_CONFIG.camera.near);
        camera.far = cameraDistance * 20;
        camera.updateProjectionMatrix();

        scrollHandle = setupScroll({
          model: loaded.model,
          camera,
          sizeScaled: loaded.sizeScaled,
          centerScaled: loaded.centerScaled
        });
      } catch {
        // Fail-safe: do not crash the UI if a resource fails to load.
      }
    };

    init();

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      const t = clock.getElapsedTime();
      godray.update(t);

      mouseLight.update({ ndc: pointer.ndc, heroCenter });
      parallax.update({ ndc: pointer.ndc });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);

      scrollHandle?.kill?.();
      godray.dispose();
      mouseLight.dispose();

      safeDispose(disposables);
    };
  }, []);

  return (
    <div className="scene">
      <canvas id="three-canvas" ref={canvasRef} />
    </div>
  );
}
