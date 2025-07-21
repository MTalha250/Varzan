"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";

const Related = () => {
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
  const products = [
    {
      image: "/images/sample.jpg",
      title: "Sample Product",
    },
    {
      image: "/images/sample.jpg",
      title: "Sample Product",
    },
    {
      image: "/images/sample.jpg",
      title: "Sample Product",
    },
    {
      image: "/images/sample.jpg",
      title: "Sample Product",
    },
    {
      image: "/images/sample.jpg",
      title: "Sample Product",
    },
    {
      image: "/images/sample.jpg",
      title: "Sample Product",
    },
    {
      image: "/images/sample.jpg",
      title: "Sample Product",
    },
    {
      image: "/images/sample.jpg",
      title: "Sample Product",
    },
  ];

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
          {products.map((product, index) => (
            <div
              key={index}
              className="basis-1/4 shrink-0 pl-8 hover:-translate-y-2 transition-all duration-300 pt-2"
            >
              <img src={product.image} alt={product.title} />
              <h2 className="text-center text-xl font-engravers mt-2 text-primary">
                {product.title}
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
