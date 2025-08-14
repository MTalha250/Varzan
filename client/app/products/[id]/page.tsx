"use client";
import React from "react";
import Main from "@/components/product/Main";
import { motion } from "framer-motion";

const ProductDetail = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="pt-44"
    >
      <Main />
      <hr />
    </motion.div>
  );
};

export default ProductDetail;
