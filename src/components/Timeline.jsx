import React, { useState } from "react";
import { FiBookOpen, FiBriefcase, FiChevronDown } from "react-icons/fi";
import Reveal from "./Reveal";
import { Eyebrow, Heading } from "./ui";
import { education, experience } from "../data/data";

const VISIBLE = 3; // bullets shown before "show more"
const pad = (n) => String(n).padStart(2, "0");

/** Brightens numbers / metrics inside a bullet (e.g. 60%+, 30,000+, 3-layer). */
const Highlight = ({ text }) =>
  text.split(/((?<![A-Za-z\d])\d[\d,.]*(?:-layer)?\+?%?\+?(?![A-Za-z\d]))/g).map((part, i) =>
    i % 2 ? (
      <span key={i} className="font-medium text-zinc-100">
        {part}
      </span>
    ) : (
      part
    )
  );

const Bullets = ({ points }) => (
  <ul className="space-y-3 text-sm leading-relaxed text-dim">
    {points.map((pt) => (
      <li key={pt} className="flex gap-3">
        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue" />
        <span>
          <Highlight text={pt} />
        </span>
      </li>
    ))}
  </ul>
);

/** Big serif year + "→ end" shown on the side opposite the card. */
const Year = ({ it, align }) => (
  <div className={`pt-2 md:pt-10 ${align === "right" ? "md:text-right" : "md:text-left"}`}>
    <p className="font-serif text-[clamp(3.5rem,8vw,7rem)] leading-none text-white">{it.year}</p>
    <p className="mt-3 font-mono text-xs tracking-[.3em] text-dim">→ {it.until}</p>
  </div>
);

const Card = ({ it, kind, n, latest }) => {
  const [open, setOpen] = useState(false);
  const points = it.points || [];
  const head = points.slice(0, VISIBLE);
  const rest = points.slice(VISIBLE);
  const uid = `more-${kind}-${n}`;

  return (
    <div
      className={`card2 !p-7 transition hover:border-white/25 md:!p-8 ${
        latest
          ? "!border-blue/40 bg-gradient-to-br from-[#14213f]/70 to-card/90 shadow-[0_0_70px_-25px_rgba(77,141,255,.6)]"
          : "bg-gradient-to-br from-[#15171d] to-card/90"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="label !tracking-[.28em]">
          {kind} {pad(n)}
        </p>
        {it.badge && (
          <span
            className={`flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[.22em] ${
              latest ? "border-blue/50 bg-blue/10 text-blue" : "border-blue/30 text-blue/90"
            }`}
          >
            {latest && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue" />}
            {it.badge}
          </span>
        )}
      </div>

      <h3 className="mt-8 font-serif text-4xl leading-tight text-white md:text-[2.6rem]">{it.title}</h3>
      <p className="mt-2 text-base text-zinc-300">{it.org}</p>
      <p className="mt-3 font-mono text-xs text-dim">{it.period}</p>

      {it.tags && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {it.tags.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
      )}

      {points.length > 0 && (
        <div className="mt-6 border-t border-line pt-6">
          <Bullets points={head} />

          {rest.length > 0 && (
            <>
              {/* animated collapse: grid rows 0fr → 1fr */}
              <div
                id={uid}
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                  open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <Bullets points={rest} />
                </div>
              </div>

              <button
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls={uid}
                className="group mt-5 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-xs text-zinc-300 hover:border-blue/60 hover:text-white"
              >
                {open ? "Show less" : `Show ${rest.length} more`}
                <FiChevronDown className={`transition-transform duration-300 ${open ? "rotate-180" : "group-hover:translate-y-0.5"}`} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const Timeline = ({ id, n, label, a, b, intro, items, icon: Icon, kind, markLatest }) => (
  <section id={id} className="section">
    <Reveal>
      <Eyebrow n={n} label={label} />
      <Heading a={a} b={b} className="mt-6" />
      <p className="mt-5 max-w-md text-dim">{intro}</p>
    </Reveal>

    <ol className="relative mt-16 flex flex-col gap-12 before:absolute before:bottom-0 before:left-4 before:top-0 before:w-px before:bg-gradient-to-b before:from-blue/70 before:via-line before:to-transparent md:gap-16 md:before:left-1/2">
      {items.map((it, i) => {
        const cardRight = i % 2 === 1;
        const latest = markLatest && i === 0;
        return (
          <Reveal as="li" key={it.title + it.org} delay={60} className="relative pl-12 md:grid md:grid-cols-2 md:pl-0">
            <span
              className={`absolute left-4 top-8 z-10 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border bg-ink md:left-1/2 ${
                latest
                  ? "border-blue text-white shadow-[0_0_30px_8px_rgba(77,141,255,.5)]"
                  : "border-blue/50 text-blue shadow-[0_0_22px_rgba(77,141,255,.3)]"
              }`}
            >
              <Icon size={17} />
            </span>

            {cardRight ? (
              <>
                {/* year left, card right */}
                <div className="order-last md:order-none md:pr-16">
                  <Year it={it} align="right" />
                </div>
                <div className="order-first md:order-none md:pl-16">
                  <Card it={it} kind={kind} n={i + 1} latest={latest} />
                </div>
              </>
            ) : (
              <>
                {/* card left, year right */}
                <div className="md:pr-16">
                  <Card it={it} kind={kind} n={i + 1} latest={latest} />
                </div>
                <div className="mt-4 md:mt-0 md:pl-16">
                  <Year it={it} align="left" />
                </div>
              </>
            )}
          </Reveal>
        );
      })}
    </ol>
  </section>
);

export const Experience = () => (
  <Timeline
    id="experience"
    n="03"
    label="where i've worked"
    a="Experience"
    b="& impact."
    intro="Roles where I shipped real features for real users."
    icon={FiBriefcase}
    kind="Role"
    markLatest
    items={experience.map((e) => ({ ...e, title: e.role }))}
  />
);

export const Education = () => (
  <Timeline
    id="education"
    n="04"
    label="my journey"
    a="Education"
    b="& growth."
    intro="Every stage added another piece to the developer I'm building."
    icon={FiBookOpen}
    kind="Stage"
    items={education}
  />
);
