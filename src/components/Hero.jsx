import React, { useEffect, useState } from "react";
import { FiArrowDown } from "react-icons/fi";
import Lanyard from "./Lanyard";
import { useMedia } from "../hooks/hooks";

const script = [
  { t: "PS C:\\Users\\tanmay> npm run portfolio", typed: true },
  { t: "✔ Compiling projects." },
  { t: "✔ Linking experience & skills." },
  { t: "Portfolio ready. Welcome.", dim: true },
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const Terminal = ({ run }) => {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    if (!run) return;
    let dead = false;
    setLines([]);
    (async () => {
      for (const l of script) {
        if (l.typed) {
          for (let i = 1; i <= l.t.length; i++) {
            if (dead) return;
            const partial = { ...l, t: l.t.slice(0, i) };
            setLines((p) => (i === 1 ? [...p, partial] : [...p.slice(0, -1), partial]));
            await sleep(32);
          }
          await sleep(350);
        } else {
          await sleep(650);
          if (dead) return;
          setLines((p) => [...p, l]);
        }
      }
    })();
    return () => {
      dead = true;
    };
  }, [run]);

  return (
    <div className="w-full max-w-xl overflow-hidden rounded-t-2xl border border-line bg-black/80 text-left font-mono text-[13px] shadow-2xl backdrop-blur">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
      <div className="min-h-[7.5rem] space-y-1.5 px-5 py-4">
        {lines.map((l, i) => (
          <p key={i} className={l.dim ? "text-dim" : "text-zinc-100"}>
            {l.t}
            {i === lines.length - 1 && <span className="animate-caret">▍</span>}
          </p>
        ))}
      </div>
    </div>
  );
};

const ScrollButton = () => (
  <a href="#about" aria-label="Scroll to about" className="relative grid h-32 w-32 place-items-center">
    <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spinSlow text-zinc-400" aria-hidden>
      <defs>
        <path id="circ" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
      </defs>
      <text fontSize="6.2" letterSpacing="2.4" fill="currentColor" className="font-mono">
        <textPath href="#circ">• FULL STACK • WEB DEVELOPER • MERN •</textPath>
      </text>
    </svg>
    <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-black transition hover:scale-110">
      <FiArrowDown size={20} />
    </span>
  </a>
);

const Hero = ({ ready = true }) => {
  const wide = useMedia("(min-width: 768px)");
  return (
  <section id="top" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
    {wide && <Lanyard className="absolute left-0 top-0 h-full w-[42%]" />}

    <div className={`relative z-10 transition-all duration-[1400ms] ease-out ${ready ? "translate-y-0 opacity-100 blur-0" : "translate-y-4 opacity-0 blur-md"}`}>
      <h1 className="font-script text-[clamp(4.5rem,11vw,9rem)] leading-[.9] text-white">Tanmay Meshram</h1>
      <p className="mt-4 text-lg text-zinc-400 md:text-3xl">
        I turn ideas into <em className="font-serif text-zinc-100">fast, polished web apps.</em>
      </p>
    </div>

    <div className="absolute inset-x-0 bottom-0 flex items-end justify-center px-6">
      <Terminal run={ready} />
    </div>
    <div className="absolute bottom-8 right-6 hidden md:block lg:right-12">
      <ScrollButton />
    </div>
  </section>
);
};

export default Hero;
