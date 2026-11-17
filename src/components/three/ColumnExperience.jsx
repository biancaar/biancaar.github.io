import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { column } from '../../config/column.js';

// Pointer-lit on desktop; fixed lighting on touch screens.
export default function ColumnExperience({ onLoaded, onFailed }) {
  const root = useRef(null);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const lifecycle = { canceled: false };
    const resources = { frameId: 0, renderer: null, observer: null, meshGroup: null };
    const pointerMotion = { rotation: 0 };
    const interactive = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = new THREE.Vector2(.35, .25);
    const lightTarget = new THREE.Vector3(1.8, 4, 4);
    const ray = new THREE.Raycaster();
    const lightPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -4);
    const clock = new THREE.Clock();
    const rimShift = { value: .5 };
    const hero = node.closest('.hero-section');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(column.camera.fov, 1, 0.1, 150);
    camera.position.set(0, column.camera.desktopY, column.camera.desktopZ);
    const warm = new THREE.DirectionalLight(column.lights.fill.color, column.lights.fill.intensity);
    warm.position.set(-5, 6, 12);
    scene.add(new THREE.AmbientLight(column.lights.ambient.color, column.lights.ambient.intensity), warm);
    const edge = new THREE.DirectionalLight(column.lights.warmRim.color, column.lights.warmRim.intensity);
    edge.position.set(3, 5, -4);
    const coolEdge = new THREE.DirectionalLight(column.lights.coolRim.color, column.lights.coolRim.intensity);
    coolEdge.position.set(-4, 3, -2);
    const cursorLight = new THREE.PointLight(column.lights.cursor.color, column.lights.cursor.intensity, 22, 2);
    cursorLight.position.copy(lightTarget);
    scene.add(edge, coolEdge, cursorLight);

    try {
      resources.renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'high-performance' });
      resources.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, interactive ? 1.5 : 1.25));
      resources.renderer.outputColorSpace = THREE.SRGBColorSpace;
      resources.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      resources.renderer.toneMappingExposure = .95;
      node.appendChild(resources.renderer.domElement);
    } catch (error) {
      onFailed?.(error); return;
    }
    const resize = () => {
      if (!node || !resources.renderer) return;
      const w = node.clientWidth || 1, h = node.clientHeight || 1;
      camera.aspect = w / h;
      const compact = window.innerWidth < 1100 || window.innerWidth <= window.innerHeight;
      // Match the CSS composition and keep the entire capital within narrow canvases.
      const minimumWidth = 4.2;
      const fittedDistance = minimumWidth / (2 * Math.tan(THREE.MathUtils.degToRad(column.camera.fov / 2)) * camera.aspect);
      camera.position.z = compact ? Math.max(column.camera.compactZ, fittedDistance) : column.camera.desktopZ;
      camera.position.y = compact ? column.camera.compactY : column.camera.desktopY;
      camera.updateProjectionMatrix();
      resources.renderer.setSize(w, h, false);
    };
    resources.observer = new ResizeObserver(resize);
    resources.observer.observe(node);
    resize();
    const onPointer = (event) => {
      if (!interactive) return;
      const bounds = node.getBoundingClientRect();
      pointer.set(THREE.MathUtils.clamp((event.clientX-bounds.left)/bounds.width*2-1,-1,1), THREE.MathUtils.clamp(1-(event.clientY-bounds.top)/bounds.height*2,-1,1));
      ray.setFromCamera(pointer, camera);
      ray.ray.intersectPlane(lightPlane, lightTarget);
      pointerMotion.rotation = pointer.x * .16;
      hero?.style.setProperty('--light-x', `${THREE.MathUtils.clamp(event.clientX / window.innerWidth * 100, 45, 95)}%`);
      hero?.style.setProperty('--light-y', `${THREE.MathUtils.clamp(event.clientY / window.innerHeight * 100, 15, 85)}%`);
    };
    if (interactive) window.addEventListener('pointermove', onPointer, { passive:true });
    const viewport = { visible: true };
    const visibility = new IntersectionObserver(entries => { viewport.visible = entries[0].isIntersecting; });
    visibility.observe(node);
    const loader = new GLTFLoader();
    loader.load(column.model, gltf => {
      if (lifecycle.canceled) { gltf.scene.traverse(o=>o.geometry?.dispose?.()); return; }
      resources.meshGroup = new THREE.Group();
      gltf.scene.scale.setScalar(1);
      const bounds = new THREE.Box3().setFromObject(gltf.scene);
      const height = Math.max(bounds.getSize(new THREE.Vector3()).y, 0.001);
      gltf.scene.scale.setScalar(12.7 / height);
      const normalized = new THREE.Box3().setFromObject(gltf.scene);
      const center = normalized.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center);
      resources.meshGroup.add(gltf.scene);
      gltf.scene.traverse(obj => {
        const materials = obj.material ? (Array.isArray(obj.material) ? obj.material : [obj.material]) : [];
        materials.forEach(mat => {
          if (!mat.isMeshStandardMaterial) return;
          mat.onBeforeCompile = shader => {
            shader.uniforms.uRimShift = rimShift;
            shader.fragmentShader = 'uniform float uRimShift;\n' + shader.fragmentShader;
            shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `
              float rim = pow(1.0 - max(dot(normalize(normal), normalize(vViewPosition)), 0.0), 3.8);
              vec3 rimColor = mix(vec3(0.20, 0.35, 0.75), vec3(1.0, 0.31, 0.10), smoothstep(-0.6, 0.6, normal.x + uRimShift * 0.4));
              outgoingLight += rimColor * rim * 0.28;
              #include <opaque_fragment>
            `);
          };
          mat.needsUpdate = true;
        });
      });
      resources.meshGroup.position.y = -1.2;
      resources.meshGroup.rotation.z = 0;
      resources.meshGroup.rotation.y = -.08;
      scene.add(resources.meshGroup);
      onLoaded?.();
    }, undefined, err => { if (!lifecycle.canceled) onFailed?.(err); });

    const render = () => {
      if (lifecycle.canceled) return;
      resources.frameId = requestAnimationFrame(render);
      if (!viewport.visible || document.hidden) return;
      const elapsed = clock.getElapsedTime();
      cursorLight.position.lerp(lightTarget, .065);
      rimShift.value += (pointer.x - rimShift.value) * .04;
      if (interactive && !reducedMotion) {
        edge.intensity = column.lights.warmRim.intensity + Math.sin(elapsed * .45) * .35;
        coolEdge.intensity = column.lights.coolRim.intensity + Math.sin(elapsed * .35 + 1.5) * .25;
      }
      if (resources.meshGroup) {
        const motion = interactive && !reducedMotion;
        const turn = motion ? pointerMotion.rotation + Math.sin(elapsed * .3) * .035 : 0;
        resources.meshGroup.rotation.y += (turn - .08 - resources.meshGroup.rotation.y) * .035;
        resources.meshGroup.position.y = -1.2 + (motion ? Math.sin(elapsed * .5) * .045 : 0);
      }
      resources.renderer.render(scene,camera);
    };
    render();
    return () => {
      lifecycle.canceled = true;
      cancelAnimationFrame(resources.frameId);
      window.removeEventListener('pointermove',onPointer);
      resources.observer?.disconnect();
      visibility.disconnect();
      scene.traverse(obj => {
        obj.geometry?.dispose?.();
        if (obj.material) (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(mat => {
          Object.values(mat).forEach(value => { if (value?.isTexture) value.dispose(); });
          mat.dispose?.();
        });
      });
      resources.renderer?.dispose();
      if (resources.renderer?.domElement?.parentNode === node) node.removeChild(resources.renderer.domElement);
    };
  }, [onLoaded,onFailed]);
  return <div className="column-webgl" ref={root} aria-hidden="true"/>;
}
