import React, { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import Reveal from "./Reveal";
import { Eyebrow, Heading } from "./ui";
import { projects } from "../data/data";
import { useInView } from "../hooks/hooks";

const pad = (n) => String(n).padStart(2, "0");
const slug = (t) => "/" + t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const Projects = () => {
  const [i, setI] = useState(0);
  const secRef = useRef(null);
  const inView = useInView(secRef);
  const touch = useRef(null);
  const total = projects.length;
  const go = (n) => setI((n + total) % total);
  const p = projects[i];

  useEffect(() => {
    if (!inView) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") setI((x) => (x + 1) % total);
      if (e.key === "ArrowLeft") setI((x) => (x - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, total]);

  return (
    <section id="projects" ref={secRef} className="section">
      <Reveal>
        <Eyebrow n="02" label="selected work" />
        <Heading a="Projects &" b="experiments." className="mt-6" />
        <p className="mt-5 font-mono text-xs text-dim">
          {pad(i + 1)} / {pad(total)}
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-14">
        <Reveal className="min-w-0">
          <ul className="border-t border-line" role="tablist" aria-label="Projects">
            {projects.map((x, n) => (
              <li key={x.id} className="border-b border-line">
                <button
                  role="tab"
                  aria-selected={n === i}
                  onClick={() => setI(n)}
                  className={`group flex w-full items-baseline gap-4 py-4 text-left font-serif text-2xl transition sm:gap-5 sm:text-3xl md:text-4xl ${
                    n === i ? "text-white" : "text-zinc-600 hover:text-zinc-300"
                  }`}
                >
                  <span className="font-mono text-[11px] text-dim">{pad(n + 1)}</span>
                  <span className={`transition-transform duration-300 ${n === i ? "translate-x-2" : "group-hover:translate-x-1"}`}>{x.title}</span>
                  <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-widest text-dim sm:block">{x.tags[0]}</span>
                </button>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100} className="min-w-0">
          <article
            className="card2 flex h-full flex-col !p-5 sm:!p-6 md:!p-8"
            onPointerDown={(e) => (touch.current = e.clientX)}
            onPointerUp={(e) => {
              if (touch.current == null) return;
              const dx = e.clientX - touch.current;
              touch.current = null;
              if (Math.abs(dx) > 60) go(i + (dx < 0 ? 1 : -1));
            }}
          >
            <div key={p.id} className="swap flex flex-1 flex-col">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-xs text-dim">
                <span>
                  PROJECT {pad(i + 1)} / {pad(total)}
                </span>
                <span className="text-blue">{slug(p.title)}</span>
              </div>
              <h3 className="mt-6 font-serif text-4xl text-white md:text-5xl">{p.title}</h3>
              <div className="mt-6 aspect-[16/8] overflow-hidden rounded-2xl border border-line">
                <img src={p.img} alt="" loading="lazy" draggable="false" className="h-full w-full object-cover opacity-80" />
              </div>
              <p className="mt-6 max-w-xl leading-relaxed text-dim">{p.desc}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-line pt-6">
              <button onClick={() => go(i - 1)} aria-label="Previous project" className="icon-btn">
                <FiArrowLeft />
              </button>
              <button onClick={() => go(i + 1)} aria-label="Next project" className="icon-btn">
                <FiArrowRight />
              </button>
              <div className="ml-3 flex items-center gap-1.5" aria-hidden>
                {projects.map((x, n) => (
                  <span key={x.id} className={`h-1.5 rounded-full transition-all ${n === i ? "w-5 bg-blue" : "w-1.5 bg-zinc-700"}`} />
                ))}
              </div>
              <a href={p.git} target="_blank" rel="noreferrer" className="pill pill-white ml-auto !py-2.5">
                Open project <FiArrowUpRight />
              </a>
            </div>
          </article>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-dim">Click a project · use ← → · or swipe</p>
        </Reveal>
      </div>
    </section>
  );
};

export default Projects;
