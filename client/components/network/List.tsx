import React from "react";
import Reveal from "../ui/reveal";

const List = () => {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-10">
      <Reveal>
        <div className="flex justify-center">
          <img src="/images/flower.png" className="w-32" />
        </div>
      </Reveal>
      <div className="flex -translate-y-2">
        <div className="w-1/2 pt-4  border-r-2 border-primary">
          <Reveal>
            <h2 className=" text-lg sm:text-xl md:text-2xl underline underline-offset-4 text-center uppercase">
              Local
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <ul className="list-disc mt-8 text-base sm:text-lg tracking-widest space-y-4 pl-8 md:pl-20">
              <li>Karachi</li>
              <li>Lahore</li>
              <li>Islamabad</li>
              <li>Gujranwala</li>
              <li>Gujarat</li>
              <li>Faislabad</li>
              <li>Hafizabad</li>
              <li>Sheikhupura</li>
              <li>Sialkot</li>
              <li>Sawat</li>
              <li>Mardan</li>
              <li>Chichawatni</li>
              <li>Mian Channu</li>
              <li>Peshawar</li>
              <li>Gojra</li>
              <li>Raheem Yar Khan</li>
              <li>Hasilpur</li>
            </ul>
          </Reveal>
        </div>
        <div className="w-1/2 pt-4 border-l-2 border-primary">
          <Reveal>
            <h2 className="text-lg sm:text-xl md:text-2xl underline underline-offset-4 text-center uppercase">
              International
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <ul className="list-disc mt-8 text-base sm:text-lg tracking-widest space-y-4 pl-8 md:pl-20">
              <li>UK</li>
              <li>Saudia Arabia</li>
              <li>USA</li>
              <li>Singapore</li>
              <li>Canada</li>
              <li>Dubai</li>
              <li>Norway</li>
              <li>Scotland</li>
            </ul>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default List;
