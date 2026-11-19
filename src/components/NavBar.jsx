import React, { useEffect, useState } from "react";
import { FiGithub, FiLinkedin, FiInstagram, FiMail, FiPlus, FiX } from "react-icons/fi";
import { profile, contactMailto } from "../data/data";

const links = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];
const socials = [
  { label: "GitHub", href: profile.socials.github, icon: FiGithub },
  { label: "LinkedIn", href: profile.socials.linkedin, icon: FiLinkedin },
  { label: "Instagram", href: profile.socials.instagram, icon: FiInstagram },
];

const NavBar = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="flex items-center justify-between bg-gradient-to-b from-ink/90 via-ink/50 to-transparent px-6 pb-7 pt-5 md:px-10">
          <a href="#top" aria-label="Home" onClick={() => setOpen(false)} className="font-script text-5xl leading-none text-white">
            TM
          </a>
          <div className="flex items-center gap-5 sm:gap-7">
            <a href={contactMailto} className="pill pill-white hidden !px-5 !py-2.5 sm:inline-flex">
              Contact me <FiMail />
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex items-center gap-2 text-base font-medium text-white"
            >
              {open ? "Close" : "Menu"} {open ? <FiX size={18} /> : <FiPlus size={18} />}
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-ink/95 px-6 backdrop-blur-xl transition-all duration-500 md:px-24 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="grid gap-12 md:grid-cols-[2fr_1fr]">
          <ul>
            {links.map((l, i) => (
              <li
                key={l.label}
                className="overflow-hidden"
                style={{ transitionDelay: `${open ? 80 + i * 40 : 0}ms` }}
              >
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-4 py-1 font-serif text-5xl text-zinc-400 hover:text-white md:text-7xl"
                >
                  <span className="font-mono text-xs text-blue">{String(i + 1).padStart(2, "0")}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-3">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div>
            <p className="label mb-5">Socials</p>
            <ul className="space-y-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-lg text-zinc-300 hover:text-white">
                    <Icon /> {label}
                  </a>
                </li>
              ))}
            </ul>
            <a href={`mailto:${profile.email}`} className="mt-10 block break-all text-sm text-dim hover:text-white">
              {profile.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
