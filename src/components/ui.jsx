import React from "react";

/** "01 —— ABOUT ME" mono eyebrow */
export const Eyebrow = ({ n, label }) => (
  <p className="label flex items-center gap-4">
    <span className="text-blue">{n}</span>
    <span className="h-px w-10 bg-line" />
    <span>{label}</span>
  </p>
);

/** Serif heading with an italic, dimmed second half */
export const Heading = ({ a, b, className = "" }) => (
  <h2 className={`font-serif text-5xl leading-[1.02] text-white md:text-7xl ${className}`}>
    {a} {b && <em className="text-zinc-500">{b}</em>}
  </h2>
);
