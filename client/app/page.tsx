"use client";
import About from "@/components/home/About";
import Highlights from "@/components/home/Highlights";
import Hero from "@/components/home/Hero";
import Video from "@/components/home/Video";
import React from "react";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <Hero />
      <About />
      <hr />
      <Video />
      <hr />
      <Highlights />
      <hr />
    </motion.div>
  );
};

export default Home;
