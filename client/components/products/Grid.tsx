"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchFilteredProducts } from "@/lib/api";
import type { Product } from "@/types";
import { useSearchParams } from "next/navigation";

const Grid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const query = searchParams.get("query");

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (selectedCategory && selectedCategory !== "All") {
          params.category = selectedCategory;
        }
        if (query) {
          params.query = query;
        }
        const res = await fetchFilteredProducts(params);
        setProducts(res.data.products || []);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [selectedCategory, query]);

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="w-full animate-pulse pt-2">
                <div className="w-full h-64 bg-gray-200" />
                <div className="h-6 bg-gray-200 mt-2 mx-auto w-1/2 rounded" />
              </div>
            ))
          : products.map((product) => (
              <Link
                href={`/products/${product._id}`}
                key={product._id}
                className="w-full hover:-translate-y-2 transition-all duration-300 pt-2"
              >
                <img
                  src={product.images?.[0] || "/images/sample.jpg"}
                  alt={product.name}
                />
                <h2 className="text-center text-xl font-engravers mt-2 text-primary">
                  {product.name}
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
