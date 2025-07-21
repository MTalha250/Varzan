import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  PhoneCall,
  Twitter,
} from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-20">
      <h1 className="text-center text-3xl uppercase tracking-widest">
        Contact Us
      </h1>
      <p className="text-center text-primary mt-8 max-w-2xl mx-auto">
        If you have questions or comments, please get a hold of us in whichever
        way is most convenient. Ask away. There is no reasonable question that
        our team cannot answer.
      </p>
      <div className="flex mt-16">
        <div className="w-1/2">
          <h2 className="text-lg">GET IN TOUCH</h2>
          <ul className="mt-4 space-y-4">
            <li className="flex items-center gap-2">
              <div className="bg-primary rounded-full p-2 w-10 h-10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="">2A-1 Rajput Town Canal Road,Lahore</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="bg-primary rounded-full p-2 w-10 h-10 flex items-center justify-center">
                <PhoneCall className="w-4 h-4 text-white" />
              </div>
              <span className="">+92 3231443144</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="bg-primary rounded-full p-2 w-10 h-10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <span className="">varzan@gmail.com</span>
            </li>
          </ul>
          <h2 className="text-lg mt-8">FOLLOW US</h2>
          <div className="flex gap-4 mt-4">
            <button className="bg-primary rounded-full p-2 w-10 h-10 shrink-0 flex items-center justify-center">
              <Instagram className="w-5 h-5 text-white" />
            </button>
            <button className="bg-primary rounded-full p-2 w-10 h-10 shrink-0 flex items-center justify-center">
              <Facebook className="w-5 h-5 text-white" />
            </button>
            <button className="bg-primary rounded-full p-2 w-10 h-10 shrink-0 flex items-center justify-center">
              <Twitter className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        <div className="w-1/2 flex flex-col gap-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-2 border border-primary rounded"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-2 border border-primary rounded"
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-primary rounded"
          />
          <textarea
            placeholder="Message"
            className="w-full p-2 border border-primary rounded"
            rows={5}
          />
          <button className="bg-primary text-white px-4 py-2 rounded w-fit">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
