import React from "react";
import { useReveal } from "../hooks/hooks";

const Reveal = ({ children, className = "", delay = 0, as: Tag = "div" }) => {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
};

export default Reveal;
