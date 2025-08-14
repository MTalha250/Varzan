"use client";
import React from "react";
import List from "@/components/network/List";
import { motion } from "framer-motion";
import Reveal from "../../components/ui/reveal";

const Network = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="pt-44"
    >
      <Reveal>
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl tracking-widest  px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
          <span className="text-primary font-embassy text-5xl sm:text-6xl md:text-7xl">
            Our
          </span>
          <br /> Network
        </h1>
      </Reveal>
      <List />
      <hr />
    </motion.div>
  );
};

export default Network;
