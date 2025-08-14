"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchFilteredProducts } from "@/lib/api";
import type { Product } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import Reveal from "../ui/reveal";

const Grid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get("category");
  const query = searchParams.get("query");
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const params: any = { page };
        if (selectedCategory && selectedCategory !== "All") {
          params.category = selectedCategory;
        }
        if (query) {
          params.query = query;
        }
        const res = await fetchFilteredProducts(params);
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [selectedCategory, query, page]);

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage > 1) {
      params.set("page", newPage.toString());
    } else {
      params.delete("page");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-10 md:py-20">
      <div className="grid grid-cols-2 md:grid-cols-3  gap-4 sm:gap-8 md:gap-10 lg:gap-20">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="w-full pt-2">
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-6 w-1/2 mx-auto mt-2 rounded" />
            </div>
          ))
        ) : products.length > 0 ? (
          products.map((product, index) => (
            <Reveal key={product._id} delay={index * 0.05}>
              <Link
                href={`/products/${product._id}`}
                className="w-full hover:-translate-y-2 transition-all duration-300 pt-2"
              >
                <img
                  src={product.images?.[0] || "/images/sample.jpg"}
                  alt={product.name}
                />
                <h2 className="text-center text-sm sm:text-base lg:text-lg xl:text-xl font-engravers mt-2 text-primary">
                  {product.name}
                </h2>
              </Link>
            </Reveal>
          ))
        ) : (
          <div className="text-center h-80 flex items-center justify-center text-2xl font-engravers text-primary col-span-full">
            No products found
          </div>
        )}
      </div>
      <div className="flex justify-center mt-10 md:mt-20 gap-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`text-white bg-primary p-2 w-10 h-10 ${
              page === i + 1 ? "opacity-100" : "opacity-60"
            }`}
            onClick={() => goToPage(i + 1)}
            disabled={page === i + 1}
          >
            {i + 1}
          </button>
        ))}
        {page < totalPages && (
          <button
            className="text-white bg-primary p-2 w-10 h-10"
            onClick={() => goToPage(page + 1)}
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default Grid;
