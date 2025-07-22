"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import type { Product } from "@/types";

const Related = ({ products }: { products: Product[] }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-20">
      <h1 className="text-center text-3xl uppercase tracking-widest">
        Related Products
      </h1>
      <div className="mt-8 flex items-center gap-8 w-full">
        <button className="text-white bg-primary p-2" onClick={scrollLeft}>
          <ChevronLeft />
        </button>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-scroll -ml-8 scrollbar-hide w-full"
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="basis-1/4 shrink-0 pl-8 hover:-translate-y-2 transition-all duration-300 pt-2"
            >
              <img
                src={product.images?.[0] || "/images/sample.jpg"}
                alt={product.name}
              />
              <h2 className="text-center text-xl font-engravers mt-2 text-primary">
                {product.name}
              </h2>
            </div>
          ))}
        </div>
        <button className="text-white bg-primary p-2" onClick={scrollRight}>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Related;
