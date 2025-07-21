import React from "react";

const List = () => {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-10">
      <div className="flex justify-center">
        <img src="/images/flower.png" className="w-32" />
      </div>
      <div className="flex -translate-y-2">
        <div className="w-1/2 px-20 border-r-2 border-primary">
          <h2 className="text-2xl underline underline-offset-4 text-center uppercase">
            Local
          </h2>
          <ul className="list-disc list-inside mt-8 text-lg tracking-widest space-y-4">
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
        </div>
        <div className="w-1/2 px-20 border-l-2 border-primary">
          <h2 className="text-2xl underline underline-offset-4 text-center uppercase">
            International
          </h2>
          <ul className="list-disc list-inside mt-8 text-lg tracking-widest space-y-4">
            <li>UK</li>
            <li>Saudia Arabia</li>
            <li>USA</li>
            <li>Singapore</li>
            <li>Canada</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default List;
