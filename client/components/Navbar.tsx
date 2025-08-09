import { Menu } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  return (
    <div className="fixed z-50 top-0 left-0 w-full border-b">
      <p className="text-sm md:text-base bg-black text-white text-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-2">
        Manufacturer And World Wide Wholesaler Zari Worked Dresses
      </p>
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-2 bg-white flex items-center justify-between">
        <Link href="/">
          <img src="/images/logo.jpeg" alt="" className="w-20 lg:w-26 p-1" />
        </Link>
        <ul className="hidden md:flex items-center gap-10 text-lg uppercase font-engravers">
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

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="text-left font-engravers text-xl">
                Menu
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 px-6">
              <ul className="flex flex-col gap-4 text-xl font-engravers">
                <li className="hover:text-primary transition-all duration-300">
                  <Link href="/">
                    <SheetClose className="block py-2">HOME</SheetClose>
                  </Link>
                </li>
                <li className="hover:text-primary transition-all duration-300">
                  <Link href="/products">
                    <SheetClose className="block py-2">PRODUCTS</SheetClose>
                  </Link>
                </li>
                <li className="hover:text-primary transition-all duration-300">
                  <Link href="/network">
                    <SheetClose className="block py-2">NETWORK</SheetClose>
                  </Link>
                </li>
                <li className="hover:text-primary transition-all duration-300">
                  <Link href="/contact">
                    <SheetClose className="block py-2">CONTACT US</SheetClose>
                  </Link>
                </li>
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
