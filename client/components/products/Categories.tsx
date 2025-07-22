"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchCategories } from "@/lib/api";
import type { Category } from "@/types";

const Categories = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get("category") || "All";
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetchCategories();
        setCategories(res.data || []);
      } catch (err) {
        setCategories([]);
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
      <div className=" flex gap-8 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => handleCategoryClick("All")}
          className={`border rounded-full py-1 px-8 cursor-pointer transition-all duration-300 ${
            selectedCategory === "All"
              ? "bg-primary text-white border-primary"
              : "text-primary border-primary hover:bg-primary hover:text-white"
          }`}
        >
          <h2 className="font-engravers text-xl">All</h2>
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => handleCategoryClick(category.name)}
            className={`border rounded-full py-1 px-8 cursor-pointer transition-all duration-300 ${
              selectedCategory === category.name
                ? "bg-primary text-white border-primary"
                : "text-primary border-primary hover:bg-primary hover:text-white"
            }`}
          >
            <h2 className="font-engravers text-xl">{category.name}</h2>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
