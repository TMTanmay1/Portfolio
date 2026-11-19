import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const TEXT = "TANMAY";
const WORLD_W = 9; // width of the particle word in world units
const LOADER_CAM = new THREE.Vector3(0, 0, 8.5);
const HERO_CAM = new THREE.Vector3(0, 2.4, 11);

const VERT = /* glsl */ `
  attribute vec3 aStart; attribute vec3 aText; attribute vec3 aField; attribute float aRand;
  uniform float uTime, uMorph, uHero, uSize; uniform vec2 uMouse;
  varying float vRand;
  float ease(float x){ return x*x*(3.0-2.0*x); }
  void main(){
    // cloud swirls until it is pulled into the word
    float a = uTime*0.25*(1.0-uMorph);
    float cs = cos(a), sn = sin(a);
    vec3 s = vec3(aStart.x*cs - aStart.z*sn, aStart.y, aStart.x*sn + aStart.z*cs);
    float m = ease(clamp((uMorph - aRand*0.35)/0.65, 0.0, 1.0));
    vec3 p = mix(s, aText, m);
    // shimmer
    p += 0.025*vec3(sin(uTime*2.0+aRand*40.0), cos(uTime*1.7+aRand*25.0), sin(uTime*1.3+aRand*60.0));
    // cursor repel (loader only)
    vec2 d = p.xy - uMouse;
    float f = smoothstep(1.4, 0.0, length(d)) * (1.0 - uHero);
    p.xy += normalize(d + 1e-4) * f * 0.7;
    p.z += f * 0.6;
    // explode into the galaxy
    float h = ease(clamp((uHero - aRand*0.45)/0.55, 0.0, 1.0));
    vec3 dir = normalize(aText + aStart*0.5 + 1e-4);
    p = mix(p, aField, h) + dir * sin(h*3.14159) * (1.0 + aRand*3.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.6 + aRand) * (6.0 / -mv.z);
    vRand = aRand;
  }
`;

const FRAG = /* glsl */ `
  varying float vRand; uniform float uAlpha;
  void main(){
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    vec3 col = mix(vec3(1.0), vec3(0.45, 0.6, 1.0), step(0.85, vRand));
    gl_FragColor = vec4(col, a * uAlpha);
  }
`;

/** Samples pixel positions of TEXT from an offscreen canvas. */
function sampleText(count) {
  const W = 1024, H = 256;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let size = 200;
  ctx.font = `600 ${size}px "JetBrains Mono", monospace`;
  while (ctx.measureText(TEXT).width > W * 0.92 && size > 40) {
    size -= 6;
    ctx.font = `600 ${size}px "JetBrains Mono", monospace`;
  }
  ctx.fillText(TEXT, W / 2, H / 2);
  const data = ctx.getImageData(0, 0, W, H).data;
  const pts = [];
  for (let y = 0; y < H; y += 2)
    for (let x = 0; x < W; x += 2)
      if (data[(y * W + x) * 4 + 3] > 128) pts.push([(x / W - 0.5) * WORLD_W, -(y / H - 0.5) * WORLD_W * (H / W)]);
  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pts[i], pts[j]] = [pts[j], pts[i]];
  }
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const p = pts[i % pts.length] || [0, 0];
    const jit = i >= pts.length ? 0.03 : 0.008;
    out[i * 3] = p[0] + (Math.random() - 0.5) * jit * 4;
    out[i * 3 + 1] = p[1] + (Math.random() - 0.5) * jit * 4;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }
  return out;
}

function buildAttributes(count) {
  const start = new Float32Array(count * 3);
  const field = new Float32Array(count * 3);
  const rand = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    rand[i] = Math.random();
    // random point inside a sphere
    const u = Math.random(), v = Math.random();
    const th = 2 * Math.PI * u, ph = Math.acos(2 * v - 1), r = 5 + Math.random() * 4;
    start.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph)], i * 3);
    // spiral galaxy with 3 arms
    const rad = Math.pow(Math.random(), 0.65) * 10;
    const arm = Math.floor(Math.random() * 3) * ((2 * Math.PI) / 3);
    const ang = rad * 0.55 + arm + (Math.random() - 0.5) * 0.7;
    const spread = (Math.random() - 0.5) * (0.6 + rad * 0.12);
    field.set([Math.cos(ang) * rad + spread, (Math.random() - 0.5) * 1.4 * (1 - rad / 12), Math.sin(ang) * rad + spread], i * 3);
  }
  return { start, field, rand };
}

/**
 * Fixed full-screen WebGL canvas. `progress` (0–100) drives the particles
 * assembling into the word; `burst` explodes them into a galaxy that then
 * rotates behind the page and reacts to mouse + scroll.
 */
const ParticleScene = ({ progress, burst }) => {
  const mountRef = useRef(null);
  const propsRef = useRef({ progress, burst });
  propsRef.current = { progress, burst };

  useEffect(() => {
    const mount = mountRef.current;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      try {
        await document.fonts?.load(`600 100px "JetBrains Mono"`);
      } catch (e) {}
      if (disposed) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
      } catch (e) {
        return; // no WebGL: page still works on the plain dark background
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
      const group = new THREE.Group();
      scene.add(group);

      const mobile = window.innerWidth < 768;
      const count = mobile ? 9000 : 20000;
      const { start, field, rand } = buildAttributes(count);
      const text = sampleText(count);

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
      geo.setAttribute("aStart", new THREE.BufferAttribute(start, 3));
      geo.setAttribute("aText", new THREE.BufferAttribute(text, 3));
      geo.setAttribute("aField", new THREE.BufferAttribute(field, 3));
      geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));

      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uHero: { value: 0 },
          uSize: { value: 2.4 * dpr },
          uAlpha: { value: 0.9 },
          uMouse: { value: new THREE.Vector2(99, 99) },
        },
      });
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      group.add(points);

      const state = { morph: 0, hero: 0, mx: 0, my: 0, mouseX: 0, mouseY: 0, visW: 10, visH: 6, scroll: 0 };
      const ease = (x) => x * x * (3 - 2 * x);

      const resize = () => {
        const w = window.innerWidth, h = window.innerHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        state.visH = 2 * LOADER_CAM.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        state.visW = state.visH * camera.aspect;
        const s = Math.min(1, (state.visW * 0.88) / WORLD_W);
        group.scale.setScalar(s);
        state.groupScale = s;
      };
      resize();

      const onMove = (e) => {
        state.mx = (e.clientX / window.innerWidth) * 2 - 1;
        state.my = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      const onScroll = () => (state.scroll = window.scrollY / window.innerHeight);
      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });

      const clock = new THREE.Clock();
      let raf;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min(clock.getDelta(), 0.05);
        const { progress: pg, burst: bu } = propsRef.current;
        const u = mat.uniforms;

        u.uTime.value += dt;
        state.morph += (pg / 100 - state.morph) * (1 - Math.exp(-dt * 3));
        u.uMorph.value = state.morph > 0.995 ? 1 : state.morph;
        state.hero = bu ? Math.min(1, state.hero + dt / 2.2) : 0;
        u.uHero.value = state.hero;
        const he = ease(state.hero);

        // cursor in word-space
        state.mouseX += (state.mx - state.mouseX) * (1 - Math.exp(-dt * 8));
        state.mouseY += (state.my - state.mouseY) * (1 - Math.exp(-dt * 8));
        u.uMouse.value.set((state.mouseX * state.visW) / 2 / state.groupScale, (state.mouseY * state.visH) / 2 / state.groupScale);

        // fade behind content once the user scrolls past the hero
        const scrollFade = 1 - 0.75 * Math.min(1, Math.max(0, state.scroll));
        u.uAlpha.value = (0.9 - 0.35 * he) * (he > 0 ? 1 - he * (1 - scrollFade) : 1);

        camera.position.lerpVectors(LOADER_CAM, HERO_CAM, he);
        camera.position.x += state.mouseX * 0.8 * he;
        camera.position.y += state.mouseY * 0.5 * he;
        camera.lookAt(0, 0, 0);

        group.rotation.y += dt * 0.05 * he;
        const targetTilt = Math.min(state.scroll, 2) * 0.3 * he;
        group.rotation.x += (targetTilt - group.rotation.x) * (1 - Math.exp(-dt * 3));

        renderer.render(scene, camera);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("scroll", onScroll);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
};

export default ParticleScene;
