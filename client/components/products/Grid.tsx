import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Grid = () => {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20">
        {products.map((product, index) => (
          <Link
            href={`/products/${product.title}`}
            key={index}
            className="w-full hover:-translate-y-2 transition-all duration-300 pt-2"
          >
            <img src={product.image} alt={product.title} />
            <h2 className="text-center text-xl font-engravers mt-2 text-primary">
              {product.title}
            </h2>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-20 gap-4">
        <button className="text-white bg-primary p-2 w-10 h-10">1</button>
        <button className="text-white bg-primary p-2 w-10 h-10">2</button>
        <button className="text-white bg-primary p-2 w-10 h-10">3</button>
        <button className="text-white bg-primary p-2 w-10 h-10">
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Grid;
