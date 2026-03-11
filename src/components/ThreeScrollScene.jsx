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
import { addStarParticles } from "../three/features/StarParticles";
import { addNebulaLayer } from "../three/features/NebulaLayer";

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
    let starsLayer = { update: () => {}, dispose: () => {} };
    let nebulaLayer = { update: () => {}, dispose: () => {} };
    let modelCenter = null;

    const getQualityOptions = () => {
      const mobileByWidth =
        window.innerWidth < (THREE_CONFIG.quality?.mobileBreakpoint ?? 768);
      const mobileByDpr =
        window.devicePixelRatio > (THREE_CONFIG.quality?.dprThreshold ?? 1.5);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      return {
        isMobile: mobileByWidth || mobileByDpr,
        reducedMotion
      };
    };

    let qualityOptions = getQualityOptions();

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

    const applyShadows = ({ frontKey, whiteRim, quality }) => {
      const shadowConfig = THREE_CONFIG.shadows;
      if (!frontKey || !shadowConfig?.enabled) return;

      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const frontShadow = shadowConfig.frontKey;
      const frontMapSize = quality.isMobile
        ? frontShadow.mapSizeMobile
        : frontShadow.mapSizeDesktop;

      frontKey.castShadow = !!frontShadow.castShadow;
      frontKey.distance = frontShadow.distance;
      frontKey.decay = frontShadow.decay;
      frontKey.angle = frontShadow.angle;
      frontKey.penumbra = frontShadow.penumbra;

      frontKey.shadow.mapSize.set(frontMapSize[0], frontMapSize[1]);
      frontKey.shadow.camera.near = frontShadow.near;
      frontKey.shadow.camera.far = frontShadow.far;
      frontKey.shadow.bias = frontShadow.bias;
      frontKey.shadow.normalBias = frontShadow.normalBias;

      if (!whiteRim) return;

      const whiteShadow = shadowConfig.whiteRim;
      const enableWhiteShadow = quality.isMobile
        ? !!whiteShadow.castShadowMobile
        : !!whiteShadow.castShadowDesktop;

      whiteRim.castShadow = enableWhiteShadow;
      if (!enableWhiteShadow) return;

      const whiteMapSize = quality.isMobile
        ? whiteShadow.mapSizeMobile
        : whiteShadow.mapSizeDesktop;

      whiteRim.shadow.mapSize.set(whiteMapSize[0], whiteMapSize[1]);
      whiteRim.shadow.camera.near = whiteShadow.near;
      whiteRim.shadow.camera.far = whiteShadow.far;
      whiteRim.shadow.bias = whiteShadow.bias;
      whiteRim.shadow.normalBias = whiteShadow.normalBias;
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
      blue.castShadow = false;
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
      red.castShadow = false;
      red.visible = !(qualityOptions.isMobile && L.redRim.disableOnMobile);
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
      front.castShadow = false;
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
      extra.castShadow = false;
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
      white.castShadow = false;
      scene.add(white);

      applyShadows({
        frontKey: front,
        whiteRim: white,
        quality: qualityOptions
      });

      return {
        frontKey: front,
        whiteRim: white,
        redRim: red,
        allSpots: [blue, red, front, extra, white]
      };
    };

    const baseLights = addBaseLights();

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
        modelCenter = loaded.centerScaled.clone();

        parallax.setBase();

        const topY = loaded.centerScaled.y + loaded.sizeScaled.y * 0.5;
        const capitalY = topY - loaded.sizeScaled.y * 0.15;

        const fov = camera.fov * (Math.PI / 180);
        const cameraDistance = loaded.sizeScaled.y / (2 * Math.tan(fov / 2));

        const frameDown = loaded.sizeScaled.y * -0.04;
        const startYOffset = -0.02;
        const lookAtYOffset = 0.03;
        const isMobileViewport = window.matchMedia("(orientation: portrait)").matches;
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
        for (const spot of baseLights.allSpots) {
          spot.target = keyTarget;
        }

        applyShadows({
          frontKey: baseLights.frontKey,
          whiteRim: baseLights.whiteRim,
          quality: qualityOptions
        });

        starsLayer = addStarParticles(scene, {
          config: THREE_CONFIG.stars,
          isMobile: qualityOptions.isMobile,
          reducedMotion: qualityOptions.reducedMotion,
          anchor: loaded.centerScaled
        });

        nebulaLayer = addNebulaLayer(scene, {
          config: THREE_CONFIG.nebula,
          camera,
          isMobile: qualityOptions.isMobile,
          reducedMotion: qualityOptions.reducedMotion,
          anchor: loaded.centerScaled
        });

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

      const dt = clock.getDelta();
      const t = clock.elapsedTime;
      godray.update(t);
      starsLayer.update(dt);
      nebulaLayer.update(dt);

      mouseLight.update({ ndc: pointer.ndc, heroCenter });
      parallax.update({ ndc: pointer.ndc });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      const nextQuality = getQualityOptions();
      const qualityChanged = nextQuality.isMobile !== qualityOptions.isMobile;
      qualityOptions = nextQuality;

      if (baseLights.redRim) {
        baseLights.redRim.visible = !(
          qualityOptions.isMobile && THREE_CONFIG.lights.redRim.disableOnMobile
        );
      }

      applyShadows({
        frontKey: baseLights.frontKey,
        whiteRim: baseLights.whiteRim,
        quality: qualityOptions
      });

      if (qualityChanged && modelCenter) {
        starsLayer.dispose();
        nebulaLayer.dispose();

        starsLayer = addStarParticles(scene, {
          config: THREE_CONFIG.stars,
          isMobile: qualityOptions.isMobile,
          reducedMotion: qualityOptions.reducedMotion,
          anchor: modelCenter
        });

        nebulaLayer = addNebulaLayer(scene, {
          config: THREE_CONFIG.nebula,
          camera,
          isMobile: qualityOptions.isMobile,
          reducedMotion: qualityOptions.reducedMotion,
          anchor: modelCenter
        });
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);

      scrollHandle?.kill?.();
      godray.dispose();
      mouseLight.dispose();
      starsLayer.dispose();
      nebulaLayer.dispose();

      safeDispose(disposables);
    };
  }, []);

  return (
    <div className="scene">
      <canvas id="three-canvas" ref={canvasRef} />
    </div>
  );
}
