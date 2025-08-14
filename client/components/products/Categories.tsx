"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchCategories } from "@/lib/api";
import type { Category } from "@/types";
import { Skeleton } from "../ui/skeleton";
import Reveal from "../ui/reveal";

const Categories = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get("category") || "All";
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const res = await fetchCategories();
        setCategories(res.data || []);
      } catch (err) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryName === "All") {
      params.delete("category");
    } else {
      params.set("category", categoryName);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-10">
      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-8 gap-4 lg:gap-6 xl:gap-8">
        {/* <button
          onClick={() => handleCategoryClick("All")}
          className={`border rounded-full py-1 px-8 cursor-pointer transition-all duration-300 ${
            selectedCategory === "All"
              ? "bg-primary text-white border-primary"
              : "text-primary border-primary hover:bg-primary hover:text-white"
          }`}
        >
          <h2 className="font-engravers text-xl">All</h2>
        </button> */}
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8 md:h-10 w-full rounded-full" />
            ))
          : categories.map((category, index) => (
              <Reveal key={category._id} delay={index * 0.03}>
                <button
                  onClick={() => handleCategoryClick(category.name)}
                  className={`border w-full rounded-full py-1 cursor-pointer transition-all duration-300 ${
                    selectedCategory === category.name
                      ? "bg-primary text-white border-primary"
                      : "text-primary border-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  <h2 className="font-engravers text-sm sm:text-base lg:text-lg xl:text-xl">
                    {category.name}
                  </h2>
                </button>
              </Reveal>
            ))}
      </div>
    </div>
  );
};

export default Categories;
