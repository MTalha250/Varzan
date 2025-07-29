import React from "react";

const Hero = () => {
  return (
    <div className="w-full h-[90vh] relative pt-34">
      <img
        src="/images/hero-bg.png"
        alt="Hero Image"
        className="w-full h-full object-cover"
      />
      <img
        src="/images/heading.png"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 md:translate-x-0 md:top-auto md:left-auto md:-bottom-6 md:right-0 z-10 w-4/5"
      />
    </div>
  );
};

export default Hero;
