import * as THREE from "three";

export function createGodray({ camera, config }) {
  const beamGroup = new THREE.Group();
  camera.add(beamGroup);

  beamGroup.position.set(...config.position);

  const beamDir = new THREE.Vector3(...config.direction).normalize();
  beamGroup.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, -1, 0),
    beamDir
  );

  const beamLightTarget = new THREE.Object3D();
  beamLightTarget.position.set(...config.beamLight.targetPosition);
  camera.add(beamLightTarget);

  const beamLight = new THREE.SpotLight(
    0xffffff,
    config.beamLight.intensity,
    config.beamLight.distance,
    config.beamLight.angle,
    config.beamLight.penumbra,
    config.beamLight.decay
  );
  beamLight.position.set(0, 0, 0);
  beamLight.target = beamLightTarget;
  beamGroup.add(beamLight);

  const GODRAY_LEN = config.len;

  const godrayGeo = new THREE.CylinderGeometry(
    config.cylinder.top,
    config.cylinder.bottom,
    GODRAY_LEN,
    config.cylinder.radialSegments,
    config.cylinder.heightSegments,
    config.cylinder.openEnded
  );
  godrayGeo.translate(0, -GODRAY_LEN / 2, 0);

  const godrayMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0xffffff) },
      uIntensity: { value: config.uniforms.uIntensity },
      uEdgeSoft: { value: config.uniforms.uEdgeSoft },
      uDensity: { value: config.uniforms.uDensity },
      uNoiseScale: { value: config.uniforms.uNoiseScale },
      uNoiseSpeed: { value: config.uniforms.uNoiseSpeed },
      uClumpScale: { value: 0.15 },   // scala “ciuffi” (più basso = ciuffi più grandi)
uClumpCut:   { value: 0.18 },   // soglia ciuffi (più alto = più buchi)
uClumpEdge:  { value: 0.28 },   // bordo dei ciuffi (più basso = più “staccati”)
uClumpPow:   { value: 2.2 }    // “pienezza” dei ciuffi (più alto = più concentrati)
    },
    vertexShader: `
      varying vec3 vPos;
      varying float vAlong;
      void main(){
        vPos = position;
        vAlong = clamp((-position.y) / ${GODRAY_LEN.toFixed(3)}, 0.0, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uIntensity;
      uniform float uEdgeSoft;
      uniform float uDensity;
      uniform float uNoiseScale;
      uniform float uNoiseSpeed;
      uniform float uClumpScale;
uniform float uClumpCut;
uniform float uClumpEdge;
uniform float uClumpPow;


      varying vec3 vPos;
      varying float vAlong;

      float sat(float x){ return clamp(x,0.0,1.0); }

      float hash(vec3 p){
        p = fract(p * 0.3183099 + vec3(0.1,0.2,0.3));
        p *= 17.0;
        return fract(p.x*p.y*p.z*(p.x+p.y*p.z));
      }

      float noise3(vec3 p){
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f*f*(3.0-2.0*f);

        float n000 = hash(i + vec3(0,0,0));
        float n100 = hash(i + vec3(1,0,0));
        float n010 = hash(i + vec3(0,1,0));
        float n110 = hash(i + vec3(1,1,0));
        float n001 = hash(i + vec3(0,0,1));
        float n101 = hash(i + vec3(1,0,1));
        float n011 = hash(i + vec3(0,1,1));
        float n111 = hash(i + vec3(1,1,1));

        float nx00 = mix(n000,n100,f.x);
        float nx10 = mix(n010,n110,f.x);
        float nx01 = mix(n001,n101,f.x);
        float nx11 = mix(n011,n111,f.x);

        float nxy0 = mix(nx00,nx10,f.y);
        float nxy1 = mix(nx01,nx11,f.y);

        return mix(nxy0,nxy1,f.z);
      }

      float fbm(vec3 p){
        float a = 0.55;
        float v = 0.0;
        v += a * noise3(p); p *= 2.02; a *= 0.5;
        v += a * noise3(p); p *= 2.01; a *= 0.5;
        v += a * noise3(p);
        return v;
      }

      void main(){
        float r = length(vPos.xz);

        float edge = 1.0 - smoothstep(0.55*0.70, 0.55, r);
        edge = pow(edge, uEdgeSoft);

        float longFade = pow(1.0 - vAlong, 1.1);
        float tail = smoothstep(1.0, 0.6, vAlong);

        vec3 p = vec3(vPos.x * uNoiseScale, vPos.y * 1.2, vPos.z * uNoiseScale);
        p += vec3(0.0, -uTime * (uNoiseSpeed), 0.0);

        // --- MACRO: isole/ciuffi grandi (buchi netti) ---
vec3 pMacro = vec3(vPos.x * uClumpScale, vPos.y * 0.65, vPos.z * uClumpScale);
pMacro += vec3(0.0, -uTime * (uNoiseSpeed * 0.55), 0.0);

float nMacro = fbm(pMacro);

// “isole” con soglia: 0 fuori, 1 dentro (con bordo controllabile)
float clumps = smoothstep(uClumpCut, uClumpCut + uClumpEdge, nMacro);

// rendi il ciuffo più “pieno” al centro
clumps = pow(clumps, uClumpPow);

// --- MICRO: dettaglio interno al ciuffo ---
vec3 pMicro = vec3(vPos.x * uNoiseScale, vPos.y * 1.2, vPos.z * uNoiseScale);
pMicro += vec3(0.0, -uTime * (uNoiseSpeed), 0.0);

float nMicro = fbm(pMicro);
float micro = smoothstep(0.35, 0.85, nMicro);

// micro contrast (più “fumoso” e meno uniforme)
micro = pow(micro, 1.35);

// smoke finale: ciuffi * dettaglio
float smoke = clumps * micro;

// alpha finale (come prima)
float alpha = edge * longFade * tail * smoke * uDensity * uIntensity;

alpha = sat(alpha);


        float core = 1.0 - smoothstep(0.0, 0.55*0.33, r);
        core = mix(1.0, 1.35, core);

        vec3 col = uColor * core;
        gl_FragColor = vec4(col, alpha);
      }
    `
  });

  const godrayMesh = new THREE.Mesh(godrayGeo, godrayMat);
  godrayMesh.frustumCulled = false;
  godrayMesh.renderOrder = 9999;
  beamGroup.add(godrayMesh);

  const dustCount = config.dust.count;
  const dustPos = new Float32Array(dustCount * 3);
  const dustSeed = new Float32Array(dustCount);
  const dustSize = new Float32Array(dustCount);
  const dustAlpha = new Float32Array(dustCount);

  for (let i = 0; i < dustCount; i++) {
    const t = Math.random();
    const y = -t * GODRAY_LEN;

    const maxR = THREE.MathUtils.lerp(0.03, 0.55, t);
    const rr = Math.sqrt(Math.random()) * maxR;
    const ang = Math.random() * Math.PI * 2;

    const x = Math.cos(ang) * rr;
    const z = Math.sin(ang) * rr;

    dustPos[i * 3 + 0] = x;
    dustPos[i * 3 + 1] = y;
    dustPos[i * 3 + 2] = z;

    dustSeed[i] = Math.random();

    const r = Math.random();
    dustSize[i] = THREE.MathUtils.lerp(1.2, 4.2, Math.pow(r, 3.0));
    dustAlpha[i] = THREE.MathUtils.lerp(
      0.15,
      0.85,
      Math.pow(Math.random(), 2.2)
    );
  }

  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute("aSeed", new THREE.BufferAttribute(dustSeed, 1));
  dustGeo.setAttribute("aSize", new THREE.BufferAttribute(dustSize, 1));
  dustGeo.setAttribute("aAlpha", new THREE.BufferAttribute(dustAlpha, 1));

  const dustMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uSmokeCut: { value: 0.55 },      // soglia: più alta = più buchi
uSmokeFeather: { value: 0.08 },  // morbidezza bordo buchi

      uSize: { value: config.dust.uSize },
      uAlpha: { value: config.dust.uAlpha }
    },
    vertexShader: `
      attribute float aSeed;
      attribute float aSize;
      attribute float aAlpha;

      uniform float uTime;
      uniform float uSize;

      varying float vA;

      void main(){
        vec3 p = position;

        float drift = sin((aSeed * 10.0) + uTime * 0.25) * 0.02;
        p.x += drift;
        p.z += drift * 0.6;

        vA = aAlpha * (0.85 + 0.15 * (sin(uTime * 0.2 + aSeed * 6.0) * 0.5 + 0.5));

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;

        gl_PointSize = (uSize * aSize) * (1.0 / max(0.6, -mv.z));
      }
    `,
    fragmentShader: `
      uniform float uAlpha;
      uniform float uSmokeCut;
uniform float uSmokeFeather;

      varying float vA;

      void main(){
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float a = 1.0 - smoothstep(0.15, 0.5, d);
        a *= uAlpha * vA;
        gl_FragColor = vec4(vec3(1.0), a);
      }
    `
  });

  const dust = new THREE.Points(dustGeo, dustMat);
  dust.frustumCulled = false;
  dust.renderOrder = 10000;
  beamGroup.add(dust);

  const update = (t) => {
    godrayMat.uniforms.uTime.value = t;
    dustMat.uniforms.uTime.value = t;
  };

  const dispose = () => {
    godrayGeo.dispose?.();
    godrayMat.dispose?.();
    dustGeo.dispose?.();
    dustMat.dispose?.();
    camera.remove(beamGroup);
    camera.remove(beamLightTarget);
  };

  return { update, dispose };
}
