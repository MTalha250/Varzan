"use client";
import React from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import Reveal from "@/components/ui/reveal";

const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="pt-28 md:pt-35"
    >
      <Reveal>
        <Footer />
      </Reveal>
    </motion.div>
  );
};

export default Contact;
