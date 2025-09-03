import React from "react";
import Reveal from "@/components/ui/reveal";

const Video = () => {
  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-20 bg-gradient-to-b from-background to-muted/20">
      <Reveal>
        <div className="flex flex-col items-center justify-center mb-12">
          <h1 className="text-center text-xl sm:text-2xl md:text-3xl uppercase tracking-widest">
            Behind the Scenes
          </h1>
          <p className="mt-6 text-base sm:text-lg text-gray-700 leading-relaxed text-center max-w-2xl">
            Discover the artistry and craftsmanship that goes into every Varzan
            creation. From our skilled artisans to our state-of-the-art
            facilities, witness the passion that brings elegance to life.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="relative max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-secondary/20">
            <video
              className="w-full h-auto aspect-video object-cover"
              src="/images/video.mp4"
              muted
              autoPlay
              loop
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl pointer-events-none"></div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-l-4 border-t-4 border-secondary opacity-60"></div>
          <div className="absolute -top-4 -right-4 w-8 h-8 border-r-4 border-t-4 border-secondary opacity-60"></div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-4 border-b-4 border-secondary opacity-60"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-4 border-b-4 border-secondary opacity-60"></div>
        </div>
      </Reveal>

      <Reveal delay={0.4}>
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 italic">
            "Excellence in every stitch, elegance in every detail"
          </p>
        </div>
      </Reveal>
    </section>
  );
};

export default Video;
