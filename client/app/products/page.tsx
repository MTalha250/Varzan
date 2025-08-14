"use client";
import React, { Suspense } from "react";
import Categories from "@/components/products/Categories";
import Grid from "@/components/products/Grid";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Reveal from "../../components/ui/reveal";

const Products = () => {
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
          <span className="text-primary font-embassy text-7xl">Our</span>
          <br /> PRODUCTS
        </h1>
      </Reveal>
      <Suspense
        fallback={
          <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-10">
            <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-8 gap-4 lg:gap-6 xl:gap-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-8 md:h-10 w-full rounded-full"
                />
              ))}
            </div>
          </div>
        }
      >
        <Categories />
      </Suspense>
      <Reveal delay={0.1}>
        <div className="flex justify-center">
          <img src="/images/flower.png" className="w-32" />
        </div>
      </Reveal>
      <Suspense
        fallback={
          <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-20">
            <div className="grid grid-cols-2 md:grid-cols-3  gap-4 sm:gap-8 md:gap-10 lg:gap-20">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="w-full pt-2">
                  <Skeleton className="h-80 w-full" />
                  <Skeleton className="h-6 w-1/2 mx-auto mt-2 rounded" />
                </div>
              ))}
            </div>
          </div>
        }
      >
        <Grid />
      </Suspense>
      <hr />
    </motion.div>
  );
};

export default Products;
