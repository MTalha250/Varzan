import React from "react";
import Categories from "@/components/products/Categories";
import Grid from "@/components/products/Grid";

const Products = () => {
  return (
    <div className="pt-44">
      <h1 className="text-center text-4xl tracking-widest  px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
        <span className="text-primary font-embassy text-7xl">Our</span>
        <br /> PRODUCTS
      </h1>
      <Categories />
      <div className="flex justify-center">
        <img src="/images/flower.png" className="w-32" />
      </div>
      <Grid />
      <hr />
    </div>
  );
};

export default Products;
