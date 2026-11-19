import React, { useEffect, useRef, useState } from "react";
import {
  SiJavascript, SiReact, SiHtml5, SiCss3, SiTailwindcss, SiNodedotjs, SiExpress,
  SiMongodb, SiMysql, SiGit, SiGithub, SiVisualstudiocode, SiVite, SiTypescript, SiNextdotjs,
  SiPython, SiFastapi, SiPostgresql, SiDocker, SiOpenai,
} from "react-icons/si";
import { FaJava, FaAws, FaRobot } from "react-icons/fa";
import { FiShare2, FiLayers, FiSearch, FiTerminal, FiLink } from "react-icons/fi";
import Reveal from "./Reveal";
import { Eyebrow, Heading } from "./ui";
import { skills, skillGroups } from "../data/data";
import { useVisibleRef } from "../hooks/hooks";

const ICONS = {
  SiJavascript, SiReact, SiHtml5, SiCss3, SiTailwindcss, SiNodedotjs, SiExpress,
  SiMongodb, SiMysql, SiGit, SiGithub, SiVisualstudiocode, SiVite, SiTypescript, SiNextdotjs,
  SiPython, SiFastapi, SiPostgresql, SiDocker, SiOpenai,
  FaJava, FaAws, FaRobot, FiShare2, FiLayers, FiSearch, FiTerminal, FiLink,
};

const tabs = ["All", ...skillGroups];
const countOf = (t) => (t === "All" ? skills.length : skills.filter((s) => s.group === t).length);
const areaAll = skills.reduce((a, s) => a + s.size * s.size, 0);

const Skills = () => {
  const [filter, setFilter] = useState("All");
  const boxRef = useRef(null);
  const visible = useVisibleRef(boxRef);
  const els = useRef([]);
  const filterRef = useRef(filter);
  filterRef.current = filter;
  const ptr = useRef({ x: -999, y: -999 });
  const drag = useRef(null);

  useEffect(() => {
    const box = boxRef.current;
    let w = box.clientWidth, h = box.clientHeight;
    const bodies = skills.map((s, i) => ({
      s, i,
      x: w / 2 + (Math.random() - 0.5) * w * 0.6,
      y: h / 2 + (Math.random() - 0.5) * h * 0.6,
      vx: 0, vy: 0, sc: 0, R: 0,
      delay: 120 + i * 55,
    }));
    const ro = new ResizeObserver(() => {
      w = box.clientWidth;
      h = box.clientHeight;
    });
    ro.observe(box);

    const onUp = () => {
      drag.current = null;
      box.style.cursor = "";
    };
    window.addEventListener("pointerup", onUp);

    let raf, last = performance.now(), started = null;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (!visible.current) {
        last = now;
        return;
      }
      if (started === null) started = now;
      const dt = Math.min(2.5, (now - last) / 16.67);
      last = now;
      const t = now / 1000;
      const f = filterRef.current;

      const bs = Math.min(1.02, Math.max(0.5, w / 1000)); // responsive base scale
      const activeArea = skills.reduce((a, s) => a + (f === "All" || s.group === f ? s.size * s.size : 0), 0) || 1;
      const k = f === "All" ? 1 : Math.min(1.6, Math.sqrt(areaAll / activeArea) * 0.88);

      for (const b of bodies) {
        const on = (f === "All" || b.s.group === f) && now - started > b.delay;
        b.sc += ((on ? 1 : 0) - b.sc) * Math.min(1, 0.12 * dt);
        if (b.sc < 0.004) b.sc = 0;
        b.R = b.s.size * bs * k * b.sc;
      }

      // forces
      for (const b of bodies) {
        if (b.R < 1) continue;
        b.vx += (w / 2 - b.x) * 0.0014 * dt + Math.sin(t * 0.7 + b.i * 1.7) * 0.012 * dt;
        b.vy += (h / 2 - b.y) * 0.0018 * dt + Math.cos(t * 0.6 + b.i * 2.3) * 0.012 * dt;
        // cursor repel
        const dx = b.x - ptr.current.x, dy = b.y - ptr.current.y;
        const d = Math.hypot(dx, dy) || 1;
        const range = b.R + 80;
        if (d < range && (!drag.current || drag.current.b !== b)) {
          const push = ((range - d) / range) * 0.9 * dt;
          b.vx += (dx / d) * push;
          b.vy += (dy / d) * push;
        }
      }
      // dragged bubble follows the pointer
      if (drag.current) {
        const b = drag.current.b;
        const nx = ptr.current.x - drag.current.ox, ny = ptr.current.y - drag.current.oy;
        b.vx = (nx - b.x) * 0.5;
        b.vy = (ny - b.y) * 0.5;
        b.x = nx;
        b.y = ny;
      }
      // collisions
      for (let it = 0; it < 3; it++) {
        for (let a = 0; a < bodies.length; a++) {
          const A = bodies[a];
          if (A.R < 1) continue;
          for (let c = a + 1; c < bodies.length; c++) {
            const B = bodies[c];
            if (B.R < 1) continue;
            const dx = B.x - A.x, dy = B.y - A.y;
            const d = Math.hypot(dx, dy) || 0.001;
            const min = A.R + B.R + 3;
            if (d >= min) continue;
            const nx = dx / d, ny = dy / d;
            const ma = A.R * A.R, mb = B.R * B.R;
            const ov = min - d;
            const dragA = drag.current && drag.current.b === A, dragB = drag.current && drag.current.b === B;
            const wa = dragA ? 0 : dragB ? 1 : mb / (ma + mb);
            const wb = dragB ? 0 : dragA ? 1 : ma / (ma + mb);
            A.x -= nx * ov * wa;
            A.y -= ny * ov * wa;
            B.x += nx * ov * wb;
            B.y += ny * ov * wb;
            const rv = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny;
            if (rv < 0) {
              const j = -rv * 0.6;
              if (!dragA) { A.vx -= nx * j * wa; A.vy -= ny * j * wa; }
              if (!dragB) { B.vx += nx * j * wb; B.vy += ny * j * wb; }
            }
          }
        }
      }
      // integrate + render
      const damp = Math.pow(0.9, dt);
      for (const b of bodies) {
        const el = els.current[b.i];
        if (!el) continue;
        if (!(drag.current && drag.current.b === b)) {
          b.x += b.vx * dt;
          b.y += b.vy * dt;
        }
        b.vx *= damp;
        b.vy *= damp;
        const R = Math.max(b.R, 0.01);
        if (b.x < R) { b.x = R; b.vx = Math.abs(b.vx) * 0.4; }
        if (b.x > w - R) { b.x = w - R; b.vx = -Math.abs(b.vx) * 0.4; }
        if (b.y < R) { b.y = R; b.vy = Math.abs(b.vy) * 0.4; }
        if (b.y > h - R) { b.y = h - R; b.vy = -Math.abs(b.vy) * 0.4; }
        const r0 = b.s.size;
        el.style.transform = `translate3d(${b.x - r0}px, ${b.y - r0}px, 0) scale(${b.R / r0})`;
        el.style.opacity = Math.min(1, b.sc * 1.6);
        el.style.pointerEvents = b.sc > 0.5 ? "auto" : "none";
      }
    };
    raf = requestAnimationFrame(tick);

    // expose bodies for pointerdown lookup
    box.__bodies = bodies;
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointerup", onUp);
    };
  }, [visible]);

  const local = (e) => {
    const r = boxRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  return (
    <section id="skills" className="section">
      <Reveal className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <Eyebrow n="05" label="my tools" />
          <Heading a="The" b="Toolbox." className="mt-6" />
        </div>
        <div className="flex max-w-full gap-1 overflow-x-auto pb-1" role="group" aria-label="Filter tools">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              aria-pressed={filter === t}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm transition ${
                filter === t ? "bg-white font-medium text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              {t} <span className={`font-mono text-[10px] ${filter === t ? "text-black/50" : "text-zinc-600"}`}>{countOf(t)}</span>
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div
          ref={boxRef}
          onPointerMove={(e) => (ptr.current = local(e))}
          onPointerLeave={() => !drag.current && (ptr.current = { x: -999, y: -999 })}
          className="relative mt-10 h-[480px] w-full overflow-hidden rounded-[36px] border border-line bg-card/30 sm:h-[660px]"
          style={{ backgroundImage: "radial-gradient(ellipse at 50% 55%, rgba(20,48,130,.28), transparent 65%)" }}
        >
          {skills.map((s, i) => {
            const Icon = ICONS[s.icon];
            return (
              <div
                key={s.name}
                ref={(el) => (els.current[i] = el)}
                onPointerDown={(e) => {
                  const b = boxRef.current.__bodies?.[i];
                  if (!b) return;
                  const p = local(e);
                  ptr.current = p;
                  drag.current = { b, ox: p.x - b.x, oy: p.y - b.y };
                  boxRef.current.style.cursor = "grabbing";
                  e.preventDefault();
                }}
                className="group absolute left-0 top-0 flex cursor-grab touch-none select-none flex-col items-center justify-center rounded-full opacity-0 will-change-transform active:cursor-grabbing"
                style={{
                  width: s.size * 2,
                  height: s.size * 2,
                  background: `radial-gradient(circle at 32% 26%, ${s.color}38, #0a0b10 74%)`,
                  boxShadow: `inset 0 0 0 1px ${s.color}26, inset 0 0 32px ${s.color}18, 0 12px 30px -14px #000`,
                }}
              >
                <Icon style={{ color: s.color, width: s.size * 0.62, height: s.size * 0.62 }} aria-hidden />
                <span className="mt-2 text-zinc-200" style={{ fontSize: Math.max(10, s.size * 0.19) }}>
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-dim">Drag the bubbles · filter by category</p>
        <ul className="sr-only">
          {skills.map((s) => (
            <li key={s.name}>
              {s.name} ({s.group})
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
};

export default Skills;
