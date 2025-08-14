"use client";
import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
};

const Reveal: React.FC<RevealProps> = ({ children, delay = 0, y = 16 }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
