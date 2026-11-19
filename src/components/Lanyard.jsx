import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useVisibleRef } from "../hooks/hooks";

// Rope + badge physics (2D verlet), rendered with three.js. Drag the badge!
const SEG = 6; // rope segments
const SEG_LEN = 40;
const CARD_D = 135; // clip → card centre
const CARD_W = 190;
const CARD_H = 250;
const DEPTH = 10;

function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function faceTexture() {
  const c = document.createElement("canvas");
  c.width = 380;
  c.height = 500;
  const x = c.getContext("2d");
  x.fillStyle = "#e7e7e4";
  x.fillRect(0, 0, 380, 500);
  x.fillStyle = "#0a0a0a";
  x.beginPath();
  x.arc(190, 44, 13, 0, Math.PI * 2);
  x.fill();
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.font = '700 150px "JetBrains Mono", monospace';
  x.fillText("</>", 190, 245);
  x.font = '600 26px "JetBrains Mono", monospace';
  x.fillText("TANMAY MESHRAM", 190, 390);
  x.fillStyle = "#555";
  x.font = '400 20px "JetBrains Mono", monospace';
  x.fillText("full stack developer", 190, 430);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

const Lanyard = ({ className = "" }) => {
  const wrapRef = useRef(null);
  const visible = useVisibleRef(wrapRef);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || window.innerWidth < 768) return; // desktop only
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    wrap.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -500, 500);
    camera.position.z = 100;
    scene.add(new THREE.AmbientLight(0xffffff, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(200, 300, 400);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x4d8dff, 1.2);
    rim.position.set(-300, 100, -100);
    scene.add(rim);

    // ---- card ----
    const card = new THREE.Group();
    const bodyGeo = new THREE.ExtrudeGeometry(roundedRect(CARD_W, CARD_H, 16), {
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 2,
      bevelSegments: 2,
      curveSegments: 10,
    });
    bodyGeo.translate(0, 0, -DEPTH / 2);
    const body = new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({ color: 0xe7e7e4, roughness: 0.45, metalness: 0.05 }));
    card.add(body);

    const tex = faceTexture();
    const faceGeo = new THREE.ShapeGeometry(roundedRect(CARD_W - 4, CARD_H - 4, 14), 10);
    const uv = faceGeo.attributes.uv, pos = faceGeo.attributes.position;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) + (CARD_W - 4) / 2) / (CARD_W - 4), (pos.getY(i) + (CARD_H - 4) / 2) / (CARD_H - 4));
    const faceMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 });
    const front = new THREE.Mesh(faceGeo, faceMat);
    front.position.z = DEPTH / 2 + 2.2;
    const back = new THREE.Mesh(faceGeo, faceMat);
    back.rotation.y = Math.PI;
    back.position.z = -DEPTH / 2 - 2.2;
    card.add(front, back);

    const clip = new THREE.Mesh(
      new THREE.TorusGeometry(10, 3, 10, 24),
      new THREE.MeshStandardMaterial({ color: 0x2a2d35, metalness: 0.9, roughness: 0.3 })
    );
    clip.position.set(0, CARD_D, 0); // card-local: at the rope attach point
    card.add(clip);
    scene.add(card);

    // ---- rope ----
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0x8fa0c4, roughness: 0.7 });
    const segGeo = new THREE.CylinderGeometry(2.4, 2.4, 1, 8);
    const segs = Array.from({ length: SEG }, () => {
      const m = new THREE.Mesh(segGeo, ropeMat);
      scene.add(m);
      return m;
    });

    // ---- physics ----
    const N = SEG + 2; // p0 anchor … p(SEG) clip … p(SEG+1) card centre
    const P = [], Q = [];
    const invMass = [];
    let W = 1, H = 1;
    const anchor = { x: 0, y: 0 };
    const rest = (i) => (i < SEG ? SEG_LEN : CARD_D);
    const reset = () => {
      P.length = Q.length = 0;
      let y = anchor.y;
      for (let i = 0; i < N; i++) {
        P.push({ x: anchor.x, y });
        Q.push({ x: anchor.x, y });
        invMass.push(i === 0 ? 0 : i === N - 1 ? 0.25 : 1);
        y -= rest(i);
      }
      P[N - 1].x += 110; // start with a swing
      Q[N - 1].x += 110;
    };

    const resize = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      renderer.setSize(W, H);
      camera.left = -W / 2;
      camera.right = W / 2;
      camera.top = H / 2;
      camera.bottom = -H / 2;
      camera.updateProjectionMatrix();
      anchor.x = W * 0.24 - W / 2;
      anchor.y = H / 2 + 12;
      if (!P.length) reset();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // ---- dragging (listeners on window so the canvas never blocks the page) ----
    const toWorld = (e) => {
      const r = wrap.getBoundingClientRect();
      return { x: e.clientX - r.left - W / 2, y: H / 2 - (e.clientY - r.top) };
    };
    const overCard = (w) => {
      const c = P[N - 1];
      const dx = w.x - c.x, dy = w.y - c.y;
      return Math.abs(dx) < CARD_W / 2 + 12 && Math.abs(dy) < CARD_H / 2 + 12;
    };
    let drag = null;
    const onDown = (e) => {
      const w = toWorld(e);
      if (!overCard(w)) return;
      drag = { x: w.x, y: w.y, vx: 0, vy: 0 };
      document.body.style.cursor = "grabbing";
      e.preventDefault();
    };
    const onMove = (e) => {
      const w = toWorld(e);
      if (drag) {
        drag.vx = w.x - drag.x;
        drag.vy = w.y - drag.y;
        drag.x = w.x;
        drag.y = w.y;
      } else {
        const inside = e.clientX >= wrap.getBoundingClientRect().left && e.clientX <= wrap.getBoundingClientRect().right;
        document.body.style.cursor = inside && overCard(w) ? "grab" : "";
      }
    };
    const onUp = () => {
      if (!drag) return;
      const c = P[N - 1], q = Q[N - 1];
      q.x = c.x - drag.vx * 0.9;
      q.y = c.y - drag.vy * 0.9;
      drag = null;
      document.body.style.cursor = "";
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);

    const step = () => {
      for (let i = 1; i < N; i++) {
        if (i === N - 1 && drag) continue;
        const p = P[i], q = Q[i];
        const vx = (p.x - q.x) * 0.996, vy = (p.y - q.y) * 0.996;
        q.x = p.x;
        q.y = p.y;
        p.x += vx;
        p.y += vy - 0.55;
      }
      if (drag) {
        const p = P[N - 1];
        p.x += (drag.x - p.x) * 0.5;
        p.y += (drag.y - p.y) * 0.5;
        Q[N - 1].x = p.x;
        Q[N - 1].y = p.y;
      }
      for (let it = 0; it < 12; it++) {
        for (let i = 0; i < N - 1; i++) {
          const a = P[i], b = P[i + 1];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.0001;
          const diff = (d - rest(i)) / d;
          const wa = invMass[i], wb = i + 1 === N - 1 && drag ? 0 : invMass[i + 1];
          const s = wa + wb;
          if (!s) continue;
          a.x += (dx * diff * wa) / s;
          a.y += (dy * diff * wa) / s;
          b.x -= (dx * diff * wb) / s;
          b.y -= (dy * diff * wb) / s;
        }
      }
    };

    const clock = new THREE.Clock();
    let raf, acc = 0, t = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible.current) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      t += dt;
      acc += dt;
      while (acc >= 1 / 60) {
        step();
        acc -= 1 / 60;
      }

      for (let i = 0; i < SEG; i++) {
        const a = P[i], b = P[i + 1];
        const m = segs[i];
        m.position.set((a.x + b.x) / 2, (a.y + b.y) / 2, 0);
        m.rotation.z = Math.atan2(b.y - a.y, b.x - a.x) - Math.PI / 2;
        m.scale.y = Math.hypot(b.x - a.x, b.y - a.y);
      }
      const clipP = P[SEG], c = P[N - 1];
      card.position.set(c.x, c.y, 0);
      card.rotation.z = Math.atan2(clipP.y - c.y, clipP.x - c.x) - Math.PI / 2;
      const swing = (c.x - Q[N - 1].x) * 0.035;
      card.rotation.y = Math.max(-0.7, Math.min(0.7, Math.sin(t * 0.9) * 0.18 + swing));
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.body.style.cursor = "";
      [bodyGeo, faceGeo, segGeo, clip.geometry].forEach((g) => g.dispose());
      [body.material, faceMat, ropeMat, clip.material].forEach((m) => m.dispose());
      tex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [visible]);

  return <div ref={wrapRef} className={`pointer-events-none ${className}`} aria-hidden />;
};

export default Lanyard;
