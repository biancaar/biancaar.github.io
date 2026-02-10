// src/components/ThreeScrollScene.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

export default function ThreeScrollScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = gsap.context(() => {
      // ============================================================
      // 1) SCENE / CAMERA / RENDERER
      // ============================================================
      const scene = new THREE.Scene();
      scene.background = null;

      const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      camera.position.set(0, 0, 3);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      // ✅ Come gltf-viewer (pipeline moderna)
      THREE.ColorManagement.enabled = true;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.useLegacyLights = false;            // importantissimo con SpotLight intensi
      renderer.physicallyCorrectLights = true;

      // Tone mapping: nel viewer è molto più “leggibile”
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.3;         // prima era 0.4 -> troppo scuro

      // Shadows
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // HDR prefilter (per envMap)
      const pmrem = new THREE.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();

      // ============================================================
      // 3) LIGHTS (le tue, ma con pipeline fisica sopra)
      // ============================================================
      const ambient = new THREE.AmbientLight(0x070a10, 0.02);
      scene.add(ambient);

      const blueRim = new THREE.SpotLight(
        0x2b7bff,
        150,
        5,
        Math.PI / 14,
        0.55,
        2.6
      );
      blueRim.position.set(-5.5, 5.8, -0.2);
      scene.add(blueRim);

      const redRim = new THREE.SpotLight(
        0xff762b,
        188,
        5,
        Math.PI / 12,
        0.18,
        2.4
      );
      redRim.position.set(5.2, 2.4, -0.8);
      scene.add(redRim);

      const frontKey = new THREE.SpotLight(
        0xfde4bd,
        20,
        70,
        Math.PI / 10,
        0.5,
        2.0
      );
      frontKey.position.set(1.0, 2.0, 2.5);
      scene.add(frontKey);

      const extraRim = new THREE.SpotLight(
        0xffa200,
        10,
        10,
        Math.PI / 2,
        0.18,
        2.4
      );
      extraRim.position.set(1, 2.4, 2.8);
      scene.add(extraRim);

      const whiteRim = new THREE.SpotLight(
        0xffffff,
        100,
        10,
        Math.PI / 2,
        0.18,
        2.4
      );
      whiteRim.position.set(0, 7, 6);
      scene.add(whiteRim);

      // ============================================================
      // 4) SHADOWS
      // ============================================================
      blueRim.castShadow = false;
      redRim.castShadow = false;
      extraRim.castShadow = false;
      whiteRim.castShadow = true;

      frontKey.castShadow = true;

      frontKey.distance = 5;
      frontKey.decay = 2;
      frontKey.angle = Math.PI / 6.5;
      frontKey.penumbra = 0.85;

      frontKey.shadow.mapSize.set(4096, 4096);
      frontKey.shadow.camera.near = 1.0;
      frontKey.shadow.camera.far = 20.0;

      frontKey.shadow.bias = -0.00015;
      frontKey.shadow.normalBias = 0.004;
      frontKey.shadow.radius = 0;

      if (frontKey.shadow.camera) {
        frontKey.shadow.camera.updateProjectionMatrix?.();
      }

      // ============================================================
      // 5) ENV HDR (una sola)
      // ============================================================
      const rgbeLoader = new RGBELoader();
      let envMap = null;

      rgbeLoader.load("/env/venice_sunset_4k.hdr", (hdrTex) => {
        envMap = pmrem.fromEquirectangular(hdrTex).texture;
        scene.environment = envMap;
        hdrTex.dispose();
        ScrollTrigger.refresh();
      });

      scene.environmentIntensity = 0.5; // prova 0.3–0.7


      // ============================================================
      // 6) LOAD MODEL (non tocchiamo le mappe già nel GLB)
      // ============================================================
      let model = null;
      let rafId = 0;

      // ✅ Height map: la aggiungiamo SOLO se il GLB non ha displacement
      const heightTexLoader = new THREE.TextureLoader();
      const heightTex = heightTexLoader.load("/textures/mat/Untitled-1.png");
      heightTex.colorSpace = THREE.NoColorSpace;
      heightTex.flipY = false;
      heightTex.wrapS = heightTex.wrapT = THREE.ClampToEdgeWrapping;

      const loader = new GLTFLoader();
      loader.load("/models/testsRedo.glb", (gltf) => {
        model = gltf.scene;

        // Center & scale
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.5 / maxDim;
        model.scale.setScalar(scale);

        model.position.y += -0.05;
        model.position.z += 0.03;

        scene.add(model);

        let didLogOnce = false;

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

            // 🔎 Debug 1 volta: vediamo cosa arriva DAVVERO dal GLB
            if (!didLogOnce) {
              console.log("GLB material:", mat);
              console.log("normalMap exists?", !!mat.normalMap);
              console.log("displacementMap exists?", !!mat.displacementMap);
              didLogOnce = true;
            }

            // ✅ Normal: se c'è, aumentiamo leggermente la forza (senza cambiare UV)
            if (mat.normalMap && mat.normalScale) {
              mat.normalScale.set(1.0, 1.0);
            }

            // ✅ Height: il GLB quasi certamente non esporta displacement.
            // Se manca, la aggiungiamo noi (senza toccare basecolor/roughness/etc).
            if (!mat.displacementMap) {
              mat.displacementMap = heightTex;
              mat.displacementScale = 0.01;   // tienilo basso: è una colonna vista da vicino
              mat.displacementBias = 0.0;
            }

            mat.needsUpdate = true;
          });
        });

        // ============================================================
        // 7) CAMERA FRAMING
        // ============================================================
        const boxScaled = new THREE.Box3().setFromObject(model);
        const sizeScaled = boxScaled.getSize(new THREE.Vector3());
        const centerScaled = boxScaled.getCenter(new THREE.Vector3());

        // ============================================================
        // 8) SHADOW-ONLY DIRECTIONAL LIGHT
        // ============================================================
        const shadowKey = new THREE.DirectionalLight(0xffffff, 0.85);
        shadowKey.castShadow = true;

        shadowKey.position.set(1.0, 3.0, 10.5);
        scene.add(shadowKey);

        shadowKey.target.position.set(
          centerScaled.x,
          centerScaled.y,
          centerScaled.z
        );
        scene.add(shadowKey.target);

        shadowKey.shadow.mapSize.set(4096, 4096);

        const r = Math.max(sizeScaled.x, sizeScaled.y, sizeScaled.z) * 0.55;
        shadowKey.shadow.camera.left = -r;
        shadowKey.shadow.camera.right = r;
        shadowKey.shadow.camera.top = r;
        shadowKey.shadow.camera.bottom = -r;

        shadowKey.shadow.camera.near = 0.1;
        shadowKey.shadow.camera.far = r * 6;

        shadowKey.shadow.bias = -0.00015;
        shadowKey.shadow.normalBias = 0.006;

        // Hero framing values
        const topY = centerScaled.y + sizeScaled.y * 0.5;
        const capitalY = topY - sizeScaled.y * 0.15;

        const fov = camera.fov * (Math.PI / 180);
        const cameraDistance = sizeScaled.y / (2 * Math.tan(fov / 2));

        const frameDown = sizeScaled.y * -0.04;
        const startYOffset = -0.02;
        const lookAtYOffset = 0.03;

        camera.position.set(
          centerScaled.x + sizeScaled.x * 0.12,
          (capitalY - frameDown) + startYOffset * sizeScaled.y,
          centerScaled.z + cameraDistance * 0.28
        );

        camera.lookAt(
          centerScaled.x,
          (capitalY - frameDown) + lookAtYOffset * sizeScaled.y,
          centerScaled.z
        );

        const keyTarget = new THREE.Object3D();
        keyTarget.position.set(centerScaled.x, capitalY, centerScaled.z);
        scene.add(keyTarget);
        frontKey.target = keyTarget;

        camera.near = cameraDistance / 50;
        camera.far = cameraDistance * 20;
        camera.updateProjectionMatrix();

        // ============================================================
        // 9) GSAP SCROLL ANIMS
        // ============================================================
        gsap
          .timeline({
            defaults: { immediateRender: false },
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true
            }
          })
          .fromTo(
            model.rotation,
            { y: -Math.PI * 0.15 },
            { y: Math.PI * 0.25, ease: "power3.out" },
            0
          )
          .fromTo(
            model.position,
            { x: model.position.x },
            { x: model.position.x + sizeScaled.x * 0.35, ease: "power2.out" },
            0
          );

        const firstPanel = document.querySelector(".panel:nth-of-type(1)");
        const lastPanel = document.querySelector(".panel:last-of-type");

        const camStartY = camera.position.y;
        const camEndY = camStartY - sizeScaled.y * 0.8;

        gsap.to(camera.position, {
          y: camEndY,
          ease: "none",
          scrollTrigger: {
            trigger: firstPanel,
            start: "bottom top",
            endTrigger: lastPanel,
            end: "bottom bottom",
            scrub: 0.5,
            invalidateOnRefresh: true
          }
        });

        ScrollTrigger.refresh();
      });

      // ============================================================
      // 10) RENDER LOOP
      // ============================================================
      const animate = () => {
        rafId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      // ============================================================
      // 11) RESIZE
      // ============================================================
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);

      // ============================================================
      // 12) CLEANUP
      // ============================================================
      return () => {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(rafId);

        if (envMap) envMap.dispose?.();
        heightTex.dispose?.();

        renderer.dispose();
      };
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="scene">
      <canvas id="three-canvas" ref={canvasRef} />
    </div>
  );
}
