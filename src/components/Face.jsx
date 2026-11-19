import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useVisibleRef } from "../hooks/hooks";

const VIEW_H = 5; // world height of the view
const EYE_X = 1.0, EYE_Y = -0.15;

const ellipse = (rx, ry, color) => {
  const g = new THREE.CircleGeometry(1, 48);
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color }));
  m.scale.set(rx, ry, 1);
  return m;
};

/** Flat 3D-ish face whose pupils follow the cursor. */
const Face = ({ className = "" }) => {
  const wrapRef = useRef(null);
  const visible = useVisibleRef(wrapRef);

  useEffect(() => {
    const wrap = wrapRef.current;
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
    const camera = new THREE.OrthographicCamera(-1, 1, VIEW_H / 2, -VIEW_H / 2, -10, 10);
    const face = new THREE.Group();
    scene.add(face);

    // ears (tilted outward)
    const earL = ellipse(0.3, 0.8, 0xffffff);
    earL.position.set(-1.25, 1.35, 0);
    earL.rotation.z = 0.32;
    const earR = ellipse(0.3, 0.8, 0xffffff);
    earR.position.set(1.25, 1.35, 0);
    earR.rotation.z = -0.32;
    face.add(earL, earR);

    // eyes: white ball + black pupil that slides inside it
    const makeEye = (x) => {
      const eye = new THREE.Group();
      eye.position.set(x, EYE_Y, 0);
      const white = ellipse(0.62, 0.52, 0xffffff);
      const pupil = ellipse(0.14, 0.24, 0x050507);
      pupil.position.z = 0.01;
      eye.add(white, pupil);
      face.add(eye);
      return { eye, pupil };
    };
    const L = makeEye(-EYE_X), R = makeEye(EYE_X);

    // nose
    const nose = ellipse(0.13, 0.08, 0xffb7c5);
    nose.position.set(0, -0.62, 0);
    face.add(nose);

    const state = { aspect: 1, rectW: 1, rectH: 1, left: 0, top: 0 };
    const resize = () => {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      renderer.setSize(w, h);
      state.aspect = w / h;
      camera.left = (-VIEW_H * state.aspect) / 2;
      camera.right = (VIEW_H * state.aspect) / 2;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // world point → screen px
    const toScreen = (rect, wx, wy) => ({
      x: rect.left + (wx / (VIEW_H * state.aspect) + 0.5) * rect.width,
      y: rect.top + (0.5 - wy / VIEW_H) * rect.height,
    });

    const clock = new THREE.Clock();
    let raf, nextBlink = 2.5, blinkT = -1;
    const look = { x: 0, y: 0 };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible.current) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const t = clock.elapsedTime;
      const kp = 1 - Math.exp(-dt * 12), kf = 1 - Math.exp(-dt * 5);
      const rect = wrap.getBoundingClientRect();

      // pupils: direction from each eye to the cursor
      [L, R].forEach(({ eye, pupil }) => {
        const c = toScreen(rect, eye.position.x + face.position.x, eye.position.y + face.position.y);
        const dx = mouse.x - c.x, dy = mouse.y - c.y;
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 260);
        const tx = (dx / d) * k * 0.34, ty = (-dy / d) * k * 0.24;
        pupil.position.x += (tx - pupil.position.x) * kp;
        pupil.position.y += (ty - pupil.position.y) * kp;
      });

      // whole face leans toward the cursor + gentle float
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      const nx = Math.max(-1, Math.min(1, (mouse.x - cx) / 500));
      const ny = Math.max(-1, Math.min(1, (mouse.y - cy) / 500));
      look.x += (nx - look.x) * kf;
      look.y += (ny - look.y) * kf;
      face.position.x = look.x * 0.22;
      face.position.y = -look.y * 0.16 + Math.sin(t * 1.4) * 0.05;
      face.rotation.z = -look.x * 0.06;
      earL.rotation.z = 0.32 + Math.sin(t * 2) * 0.02;
      earR.rotation.z = -0.32 - Math.sin(t * 2 + 1) * 0.02;

      // blink
      if (blinkT < 0 && t > nextBlink) blinkT = t;
      let sy = 1;
      if (blinkT >= 0) {
        const p = (t - blinkT) / 0.18;
        sy = p >= 1 ? 1 : Math.max(0.08, Math.abs(1 - p * 2));
        if (p >= 1) {
          blinkT = -1;
          nextBlink = t + 2.5 + Math.random() * 3;
        }
      }
      L.eye.scale.y = R.eye.scale.y = sy;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene.traverse((o) => {
        o.geometry?.dispose();
        o.material?.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [visible]);

  return <div ref={wrapRef} className={className} aria-hidden />;
};

export default Face;
