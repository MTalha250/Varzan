import { Facebook, Instagram, Phone, Twitter } from "lucide-react";
import React from "react";

const Main = () => {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 flex gap-10 pb-20">
      <img
        src="/images/sample.jpg"
        alt=""
        className="w-2/5 h-[75vh] object-cover"
      />
      <div className="w-3/5">
        <h1 className="text-4xl text-primary">Sample Product</h1>
        <p className="text-gray-500 mt-2">Category: Sample Category</p>
        <p className="mt-4 text-xl underline underline-offset-4">Details: </p>
        <ul className="list-disc list-inside mt-2">
          <li>Sample Category</li>
          <li>Sample Fabric</li>
          <li>Sample Color</li>
          <li>100% Adda Work</li>
        </ul>
        <p className="mt-4 text-xl underline underline-offset-4">About Us: </p>
        <p className="mt-2">
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
        <div className="mt-8 flex items-center gap-5">
          <img src="/images/sample.jpg" alt="" className="w-20" />
          <img src="/images/sample.jpg" alt="" className="w-20" />
          <img src="/images/sample.jpg" alt="" className="w-20" />
          <img src="/images/sample.jpg" alt="" className="w-20" />
        </div>
      </div>
    </div>
  );
};

export default Main;
