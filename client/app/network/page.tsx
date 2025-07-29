import React from "react";
import List from "@/components/network/List";

const Network = () => {
  return (
    <div className="pt-44">
      <h1 className="text-center text-2xl sm:text-3xl md:text-4xl tracking-widest  px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
        <span className="text-primary font-embassy text-5xl sm:text-6xl md:text-7xl">
          Our
        </span>
        <br /> Network
      </h1>
      <List />
      <hr />
    </div>
  );
};

export default Network;
