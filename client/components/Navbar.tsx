import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="fixed z-50 top-0 left-0 w-full border-b">
      <p className="bg-black text-white text-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-2">
        Manufacturer And World Wide Wholesaler Zari Worked Dresses
      </p>
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-2 bg-white flex items-center justify-between">
        <Link href="/">
          <img src="/images/logo.jpeg" alt="" className="w-26 p-1" />
        </Link>
        <ul className="flex items-center gap-10 text-lg uppercase font-engravers">
          <li className="hover:text-primary transition-all duration-300">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-primary transition-all duration-300">
            <Link href="/products">Products</Link>
          </li>
          <li className="hover:text-primary transition-all duration-300">
            <Link href="/network">Network</Link>
          </li>
          <li className="hover:text-primary transition-all duration-300">
            <Link href="/contact">Contact Us</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
