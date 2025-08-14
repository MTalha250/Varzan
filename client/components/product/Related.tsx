"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import type { Product } from "@/types";
import Link from "next/link";

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
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-10 md:py-20">
      <h1 className="text-center text-xl sm:text-2xl md:text-3xl uppercase tracking-widest">
        Related Products
      </h1>
      <div className="mt-8 flex items-center md:gap-4 lg:gap-8 w-full relative">
        <button
          className="hidden md:block text-white bg-primary p-1 sm:p-2"
          onClick={scrollLeft}
        >
          <ChevronLeft />
        </button>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-scroll -ml-4 md:-ml-8 scrollbar-hide w-full"
        >
          {products.length > 0 ? (
            products.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="basis-1/2 lg:basis-1/3 shrink-0 pl-4 md:pl-8 hover:-translate-y-2 transition-all duration-300 pt-2"
              >
                <img
                  src={product.images?.[0] || "/images/sample.jpg"}
                  alt={product.name}
                />
                <h2 className="text-center text-sm sm:text-base lg:text-lg xl:text-xl font-engravers mt-2 text-primary">
                  {product.name}
                </h2>
              </Link>
            ))
          ) : (
            <div className="pl-4 md:pl-8 w-full h-80 flex items-center justify-center text-center text-2xl font-engravers text-primary">
              No products found
            </div>
          )}
        </div>
        <button
          className="hidden md:block text-white bg-primary p-1 sm:p-2"
          onClick={scrollRight}
        >
          <ChevronRight />
        </button>
        <div className="w-[102%] flex justify-between md:hidden absolute top-1/2 -translate-y-1/2 -left-2">
          <button className="text-white bg-primary p-1 sm:p-2">
            <ChevronLeft />
          </button>
          <button className="text-white bg-primary p-1 sm:p-2">
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Related;
