import React, { Suspense } from "react";
import Categories from "@/components/products/Categories";
import Grid from "@/components/products/Grid";

const Products = () => {
  return (
    <div className="pt-44">
      <h1 className="text-center text-2xl sm:text-3xl md:text-4xl tracking-widest  px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
        <span className="text-primary font-embassy text-7xl">Our</span>
        <br /> PRODUCTS
      </h1>
      <Suspense
        fallback={
          <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-10">
            <div className="flex gap-8 overflow-x-auto scrollbar-hide">
              <div className="border text-primary rounded-full border-primary py-1 px-8 animate-pulse bg-gray-200">
                <h2 className="font-engravers text-xl">All</h2>
              </div>
            </div>
          </div>
        }
      >
        <Categories />
      </Suspense>
      <div className="flex justify-center">
        <img src="/images/flower.png" className="w-32" />
      </div>
      <Suspense
        fallback={
          <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="w-full animate-pulse pt-2">
                  <div className="w-full h-64 bg-gray-200" />
                  <div className="h-6 bg-gray-200 mt-2 mx-auto w-1/2 rounded" />
                </div>
              ))}
            </div>
          </div>
        }
      >
        <Grid />
      </Suspense>
      <hr />
    </div>
  );
};

export default Products;
