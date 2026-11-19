import React, { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiGithub, FiLinkedin, FiInstagram, FiMail, FiMapPin } from "react-icons/fi";
import Reveal from "./Reveal";
import Face from "./Face";
import { Eyebrow, Heading } from "./ui";
import { profile, chapters } from "../data/data";
import { useClock } from "../hooks/hooks";

/** Words light up as the paragraph scrolls through the viewport. */
const ScrollWords = ({ text }) => {
  const ref = useRef(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const vh = window.innerHeight;
      setP(Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  const words = text.split(" ");
  return (
    <p ref={ref} className="text-xl leading-relaxed md:text-2xl" aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="transition-colors duration-300" style={{ color: i / words.length < p ? "#fff" : "#4a4a52" }}>
          {w}{" "}
        </span>
      ))}
    </p>
  );
};

const About = () => {
  const time = useClock("Asia/Kolkata");
  return (
    <section id="about" className="section">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.4fr)] lg:gap-20">
        {/* profile card */}
        <Reveal className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="card2 !p-5 sm:!p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="font-serif text-3xl leading-none text-white sm:text-4xl">
                Tanmay <span className="text-zinc-500">Meshram</span>
              </h3>
              <span className="flex shrink-0 items-center gap-2 rounded-full border border-line px-3 py-1 text-xs text-zinc-200">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Available
              </span>
            </div>
            <p className="mt-4 flex items-center gap-2 font-mono text-xs text-dim">
              <FiMapPin /> India <span>·</span> {time}
            </p>
            <Face className="mx-auto my-6 h-64 w-full" />
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-line pt-5">
              <div className="flex gap-2">
                <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="icon-btn"><FiGithub /></a>
                <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="icon-btn"><FiLinkedin /></a>
                <a href={profile.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="icon-btn"><FiInstagram /></a>
              </div>
              <a href={`mailto:${profile.email}`} className="flex min-w-0 items-center gap-2 text-sm text-zinc-300 hover:text-white">
                <FiMail className="shrink-0" /> <span className="truncate">{profile.email}</span> <FiArrowUpRight className="shrink-0" />
              </a>
            </div>
          </div>
        </Reveal>

        {/* story */}
        <div>
          <Reveal>
            <Eyebrow n="01" label="about" />
            <Heading a="A short story," b="told simply." className="mt-6" />
          </Reveal>
          <div className="mt-10 max-w-2xl">
            <ScrollWords text={profile.bio} />
          </div>

          <ol className="relative mt-16 space-y-12 border-l border-line pl-8">
            {chapters.map((c, i) => (
              <Reveal as="li" key={c.title} delay={i * 80} className="relative">
                <span className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full bg-blue shadow-[0_0_14px_3px_rgba(77,141,255,.55)]" />
                <p className="label !tracking-[.25em]">Chapter {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-serif text-4xl text-white">{c.title}</h3>
                <p className="mt-3 max-w-lg leading-relaxed text-dim">{c.text}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-20">
            <p className="font-serif text-4xl text-white md:text-5xl">
              Let's create something <em className="text-zinc-500">impactful.</em>
            </p>
            <p className="mt-3 text-dim">Open to opportunities and collaborations.</p>
            <a href="#contact" className="pill pill-white mt-6">
              Connect with me <FiArrowUpRight />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default About;
