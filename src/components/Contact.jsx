import React from "react";
import { FiArrowUpRight, FiDownload, FiGithub, FiInstagram, FiLinkedin, FiPhone } from "react-icons/fi";
import Reveal from "./Reveal";
import { Eyebrow } from "./ui";
import { profile, contactMailto } from "../data/data";
import resumePDF from "../assets/Resume.pdf";
import avatar from "../assets/avatar-pixel.png";
import PixelAvatar from "./PixelAvatar";

const Contact = () => (
  <footer id="contact" className="section !pb-10">
    <div className="grid items-center gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
      <Reveal>
        <Eyebrow n="06" label="contact" />
        <h2 className="mt-6 font-serif text-5xl leading-[1] text-white md:text-7xl">
          Let's create something <em className="text-zinc-500">impactful.</em>
        </h2>
        <p className="mt-6 max-w-md text-dim">Have a project, an internship or a full-time role in mind? Say hello — I reply quickly.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={contactMailto} className="pill pill-white">
            Contact me <FiArrowUpRight />
          </a>
          <a href={resumePDF} download className="pill pill-line">
            Resume <FiDownload />
          </a>
        </div>
        <p className="mt-5 font-mono text-xs text-dim">
          or write to{" "}
          <a href={`mailto:${profile.email}`} className="text-zinc-300 underline underline-offset-4 hover:text-white">
            {profile.email}
          </a>
        </p>
      </Reveal>

      <Reveal delay={120}>
        <PixelAvatar src={avatar} alt="Pixel-art portrait of Tanmay Meshram" label="tanmay.png" note="pixel art" bleed />
      </Reveal>
    </div>

    <div className="mt-24 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
      <div className="flex gap-2">
        <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="icon-btn"><FiGithub /></a>
        <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="icon-btn"><FiLinkedin /></a>
        <a href={profile.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="icon-btn"><FiInstagram /></a>
        <a href={`tel:${profile.phone.replace(/\s/g, "")}`} aria-label="Phone" className="icon-btn"><FiPhone /></a>
      </div>
      <p className="font-mono text-xs text-dim">
        © {new Date().getFullYear()} {profile.name}
      </p>
      <a href="#top" className="font-mono text-xs text-dim hover:text-white">
        back to top ↑
      </a>
    </div>
  </footer>
);

export default Contact;
