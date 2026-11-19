import React, { useCallback, useEffect, useState } from "react";
import ParticleScene from "./components/ParticleScene";
import Loader from "./components/Loader";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import { Experience, Education } from "./components/Timeline";
import Skills from "./components/Skills";
import Contact from "./components/Contact";

const App = () => {
  const [progress, setProgress] = useState(0);
  const [burst, setBurst] = useState(false);
  const [ready, setReady] = useState(false);

  const onProgress = useCallback((p) => setProgress(p), []);
  const onBurst = useCallback(() => setBurst(true), []);

  // start the hero animations once the explosion has settled
  useEffect(() => {
    if (!burst) return;
    const t = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(t);
  }, [burst]);

  return (
    <>
      <ParticleScene progress={progress} burst={burst} />
      <Loader onProgress={onProgress} onBurst={onBurst} />
      <div
        className="relative z-10"
        style={{
          opacity: burst ? 1 : 0,
          pointerEvents: burst ? "auto" : "none",
          transition: "opacity 1.2s ease .5s",
        }}
      >
        <NavBar />
        <main>
          <Hero ready={ready} />
          <About />
          <Projects />
          <Experience />
          <Education />
          <Skills />
        </main>
        <Contact />
      </div>
    </>
  );
};

export default App;
