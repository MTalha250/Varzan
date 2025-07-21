"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";

const Testimonials = () => {
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
  const testimonials = [
    {
      image: "/images/sample.jpg",
      name: "John Doe",
      email: "john.doe@example.com",
      message:
        "This process involves incorporating the finishing materials such as tussles, poles, belts, zips, etc. Final inspection of the dress along with the neatening of small details is processed. The final product is then steam pressed to make it ready to ship and wear condition.",
    },
    {
      image: "/images/sample.jpg",
      name: "John Doe",
      email: "john.doe@example.com",
      message:
        "This process involves incorporating the finishing materials such as tussles, poles, belts, zips, etc. Final inspection of the dress along with the neatening of small details is processed. The final product is then steam pressed to make it ready to ship and wear condition.",
    },
    {
      image: "/images/sample.jpg",
      name: "John Doe",
      email: "john.doe@example.com",
      message:
        "This process involves incorporating the finishing materials such as tussles, poles, belts, zips, etc. Final inspection of the dress along with the neatening of small details is processed. The final product is then steam pressed to make it ready to ship and wear condition.",
    },
    {
      image: "/images/sample.jpg",
      name: "John Doe",
      email: "john.doe@example.com",
      message:
        "This process involves incorporating the finishing materials such as tussles, poles, belts, zips, etc. Final inspection of the dress along with the neatening of small details is processed. The final product is then steam pressed to make it ready to ship and wear condition.",
    },
    {
      image: "/images/sample.jpg",
      name: "John Doe",
      email: "john.doe@example.com",
      message:
        "This process involves incorporating the finishing materials such as tussles, poles, belts, zips, etc. Final inspection of the dress along with the neatening of small details is processed. The final product is then steam pressed to make it ready to ship and wear condition.",
    },
    {
      image: "/images/sample.jpg",
      name: "John Doe",
      email: "john.doe@example.com",
      message:
        "This process involves incorporating the finishing materials such as tussles, poles, belts, zips, etc. Final inspection of the dress along with the neatening of small details is processed. The final product is then steam pressed to make it ready to ship and wear condition.",
    },
  ];

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-20">
      <h1 className="text-center text-3xl uppercase tracking-widest">
        Client Reviews
      </h1>
      <div className="mt-8 flex items-center gap-8 w-full">
        <button className="text-white bg-primary p-2" onClick={scrollLeft}>
          <ChevronLeft />
        </button>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-scroll scrollbar-hide w-full -ml-8"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="basis-1/3 shrink-0 pl-8 hover:-translate-y-2 transition-all duration-300 pt-2"
            >
              <div className="border-primary border-2 p-4">
                <div className="flex gap-4 item-center">
                  <img
                    src="/images/sample.jpg"
                    alt="testimonial"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <div>
                    <h2 className="text-sm font-bold">{testimonial.name}</h2>
                    <p className="text-xs text-gray-500">{testimonial.email}</p>
                  </div>
                </div>
                <p className="text-sm mt-4 text-justify">
                  {testimonial.message}
                </p>
              </div>
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

export default Testimonials;
