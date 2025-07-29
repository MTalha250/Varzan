"use client";
import { Facebook, Instagram, Phone, Twitter } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchProductById } from "@/lib/api";
import type { Product } from "@/types";
import Related from "./Related";

const Main = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      try {
        const res = await fetchProductById(id as string);
        setProduct(res.data.product);
        setRelated(res.data.related || []);
      } catch (err) {
        setProduct(null);
        setRelated([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) getProduct();
  }, [id]);

  return (
    <>
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 flex flex-col md:flex-row gap-5 lg:gap-10 pb-10 md:pb-20">
        <img
          src={product?.images[0]}
          alt={product?.name}
          className="w-full md:w-1/2 lg:w-2/5 object-cover"
        />
        <div className="w-full md:w-1/2 lg:w-3/5">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-primary">
            {product?.name}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
            Category: {product?.category}
          </p>
          <p className="mt-4 text-lg md:text-xl underline underline-offset-4">
            Details:{" "}
          </p>
          <ul className="list-disc list-inside mt-2 text-sm sm:text-base">
            {product?.details.map((detail, i) => (
              <li key={i}>{detail}</li>
            ))}
          </ul>
          <p className="mt-4 text-lg md:text-xl underline underline-offset-4">
            About Us:{" "}
          </p>
          <p className="mt-2 text-sm sm:text-base">
            We run a production house that provides services regarding adda and
            stitching work for traditional formal wear. we are a wholesaler and
            this website is only for brand awareness. we only cater to the
            customer after the appointment.
          </p>
          <button className="flex mt-4 w-full">
            <span className="bg-primary text-white text-[15px] p-2">
              Talk to us
            </span>
            <span className="border p-2">
              <Phone className="w-5 h-5" strokeWidth={1} />
            </span>
          </button>
          <div className="flex mt-4 items-center gap-2">
            <span>SHARE</span>
            <div className="flex gap-2">
              <button className="bg-primary rounded-full p-2 w-8 h-8 shrink-0 flex items-center justify-center">
                <Instagram className="w-4 h-4 text-white" />
              </button>
              <button className="bg-primary rounded-full p-2 w-8 h-8 shrink-0 flex items-center justify-center">
                <Facebook className="w-4 h-4 text-white" />
              </button>
              <button className="bg-primary rounded-full p-2 w-8 h-8 shrink-0 flex items-center justify-center">
                <Twitter className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          <div className="hidden md:flex mt-8 items-center gap-5">
            {product?.images.map((img, i) => (
              <img src={img} alt="" className="w-20" key={i} />
            ))}
          </div>
        </div>
      </div>
      <Related products={related} />
      <hr />
    </>
  );
};

export default Main;
