"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Product } from "@/types";
import { fetchHighlightedProducts } from "@/lib/api";
import Link from "next/link";
import Reveal from "../ui/reveal";

const Highlights = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      const res = await fetchHighlightedProducts();
      setProducts(res.data.products);
    };
    getProducts();
  }, []);

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
      <Reveal>
        <h1 className="text-center text-xl sm:text-2xl md:text-3xl uppercase tracking-widest">
          Product Highlights
        </h1>
      </Reveal>
      <div className="mt-8 flex items-center gap-4 sm:gap-8 w-full">
        <button
          className="text-white bg-primary p-1 sm:p-2"
          onClick={scrollLeft}
        >
          <ChevronLeft />
        </button>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-scroll -ml-8 scrollbar-hide w-full"
        >
          {products.map((product, index) => (
            <Link
              href={`/products/${product._id}`}
              key={index}
              className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 shrink-0 pl-8 hover:-translate-y-2 transition-all duration-300 pt-2"
            >
              <Reveal delay={index * 0.05}>
                <img src={product.images[0]} alt={product.name} />
                <h2 className="text-center text-xl font-engravers mt-2 text-primary">
                  {product.name}
                </h2>
              </Reveal>
            </Link>
          ))}
        </div>
        <button
          className="text-white bg-primary p-1 sm:p-2"
          onClick={scrollRight}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Highlights;
