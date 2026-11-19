import React, { useEffect, useState } from "react";

const greetings = ["hello", "namaste", "hola", "bonjour", "ciao", "konnichiwa", "hallo", "hello"];
const DURATION = 3200; // ms for the counter to reach 100
const reduceMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * HUD overlay for the WebGL preloader (the particles live in ParticleScene).
 * Reports progress upward, then triggers the burst and fades itself out.
 */
const Loader = ({ onProgress, onBurst }) => {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState("loading"); // loading | leaving | gone
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const loaded = new Promise((res) =>
      document.readyState === "complete" ? res() : window.addEventListener("load", res, { once: true })
    );
    Promise.all([fonts, loaded]).then(() => alive && setAssetsReady(true));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = phase === "gone" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  // eased 0 → 99, then 100 once assets are ready
  useEffect(() => {
    const dur = reduceMotion() ? 600 : DURATION;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.min(assetsReady ? 100 : 99, Math.round(eased * 100));
      setPct(next);
      onProgress(next);
      if (t < 1 || !assetsReady) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [assetsReady, onProgress]);

  // word is fully formed → hold a beat → burst
  useEffect(() => {
    if (pct < 100 || phase !== "loading") return;
    const a = setTimeout(() => {
      setPhase("leaving");
      onBurst();
    }, 900);
    return () => clearTimeout(a);
  }, [pct, phase, onBurst]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const b = setTimeout(() => setPhase("gone"), 1000);
    return () => clearTimeout(b);
  }, [phase]);

  if (phase === "gone") return null;

  const word = greetings[Math.min(greetings.length - 1, Math.floor((pct / 100) * greetings.length))];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading ${pct}%`}
      className={`loader font-mono fixed inset-0 z-[100] flex flex-col justify-between px-6 py-8 text-white md:px-12 ${
        phase === "leaving" ? "loader-leave" : ""
      }`}
    >
      <div className="flex items-start justify-between text-sm">
        <span className="border border-white/80 px-2 py-1 text-xl tracking-widest">TM</span>
        <span className="text-dim">portfolio / {new Date().getFullYear()}</span>
      </div>

      <div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p key={word} className="loader-word text-2xl font-extralight sm:text-4xl">
              {word}
              <span className="text-blue">.</span>
            </p>
            <p className="mt-2 text-sm text-dim">full stack developer</p>
          </div>
          <p className="loader-count font-extralight leading-none tabular-nums text-white">
            {String(pct).padStart(3, "0")}
            <span className="text-dim">%</span>
          </p>
        </div>
        <div className="mt-6 h-px w-full bg-line">
          <div className="h-full origin-left bg-white" style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
      </div>
    </div>
  );
};

export default Loader;
