import React, { useEffect, useRef, useState } from "react";

const sparkles = [
  { x: "12%", y: "16%", d: "0s", s: 8 },
  { x: "84%", y: "12%", d: ".7s", s: 6 },
  { x: "90%", y: "46%", d: "1.4s", s: 8 },
  { x: "7%", y: "52%", d: "2.1s", s: 6 },
  { x: "78%", y: "30%", d: "2.8s", s: 4 },
  { x: "20%", y: "34%", d: "3.5s", s: 4 },
];

// card width available per breakpoint
const available = () => (window.innerWidth >= 1024 ? 430 : window.innerWidth >= 640 ? 344 : 258);

/**
 * Pixel-art portrait on a themed backdrop. Works with any image:
 *  - small sprites (≤256px wide) are scaled by whole numbers with crisp pixels
 *  - larger AI-generated art is simply scaled to fit, with smooth resampling
 * The figure shifts in steps toward the cursor so the parallax feels pixelated.
 */
const PixelAvatar = ({ src, alt = "", className = "", label = "tanmay.png", note, parallax = true, bleed = false }) => {
  const frame = useRef(null);
  const fig = useRef(null);
  const [dim, setDim] = useState({ w: 86, h: 85 });
  const [boxW, setBoxW] = useState(258);
  const sprite = dim.w <= 256;

  // card width: whole multiples of the sprite's pixels, or just the available width
  useEffect(() => {
    const calc = () => {
      const a = available();
      setBoxW(sprite ? dim.w * Math.max(1, Math.floor(a / dim.w)) : a);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [dim, sprite]);

  useEffect(() => {
    const el = frame.current;
    const f = fig.current;
    if (!parallax || !el || !f || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const unit = r.width / (sprite ? dim.w : 64); // one "pixel" step on screen
      const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
      // "bleed" art runs off the frame edges, so it only slides sideways and is slightly oversized to cover the gap
      f.style.transform = bleed
        ? `translate(${Math.round(nx * 2) * unit}px, 0) scale(1.08)`
        : `translate(${Math.round(nx * 2) * unit}px, ${Math.round(ny) * unit}px)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [dim, sprite, parallax, bleed]);

  return (
    <figure className={`mx-auto max-w-full lg:ml-auto lg:mr-0 ${className}`} style={{ width: boxW }}>
      <div
        ref={frame}
        className="relative w-full overflow-hidden border-2 border-blue/70 bg-[#0b1230] shadow-[0_0_0_4px_#050507,0_0_0_5px_rgba(77,141,255,.35),0_30px_80px_-30px_rgba(77,141,255,.55)]"
        style={{
          aspectRatio: `${dim.w} / ${dim.h}`,
          backgroundImage:
            "radial-gradient(ellipse at 50% 38%, rgba(60,100,230,.45), transparent 62%), linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)",
          backgroundSize: "auto, 25% 25%, 25% 25%",
        }}
      >
        {sparkles.map((s, i) => (
          <span
            key={i}
            aria-hidden
            className="pixel-blink absolute bg-white/80"
            style={{ left: s.x, top: s.y, width: s.s, height: s.s, animationDelay: s.d }}
          />
        ))}

        <img
          ref={fig}
          src={src}
          alt={alt}
          draggable="false"
          onLoad={(e) => setDim({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
          className="absolute inset-0 h-full w-full select-none object-cover object-bottom transition-transform duration-200 ease-out"
          style={{
            imageRendering: sprite ? "pixelated" : "auto",
            transitionTimingFunction: "steps(3, end)",
            transformOrigin: "50% 100%",
            transform: bleed ? "scale(1.08)" : undefined,
          }}
        />

        {/* retro scanlines + soft vignette so the art sits inside the frame */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,.08) 0, rgba(0,0,0,.08) 1px, transparent 1px, transparent 3px), radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(5,5,12,.55) 100%)",
          }}
        />

        {["left-0 top-0", "right-0 top-0", "left-0 bottom-0", "right-0 bottom-0"].map((p) => (
          <span key={p} aria-hidden className={`absolute h-2 w-2 bg-[#050507] ${p}`} />
        ))}
      </div>
      <figcaption className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-dim">
        <span>{label}</span>
        <span>{note ?? (sprite ? `${dim.w}×${dim.h} px` : "pixel art")}</span>
      </figcaption>
    </figure>
  );
};

export default PixelAvatar;
