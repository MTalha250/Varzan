import About from "@/components/home/About";
import Highlights from "@/components/home/Highlights";
import Hero from "@/components/home/Hero";
import React from "react";
import Testimonials from "@/components/home/Testimonials";

const Home = () => {
  return (
    <div>
      <Hero />
      <About />
      <hr />
      <Highlights />
      <hr />
      <Testimonials />
      <hr />
    </div>
  );
};

export default Home;
