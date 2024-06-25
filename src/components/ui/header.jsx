import React from 'react';
import Link from "next/link"
import BabyIcon from "@/components/ui/icons/baby";

const Header = () => {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-[#E6E6FA] shadow-md">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <BabyIcon className="h-6 w-6 text-[#000080]" />
        <span className="sr-only">LunaFocus</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          href="#"
          className="text-sm font-medium hover:text-[#000080] text-[#333333]"
          prefetch={false}>
          Features
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:text-[#000080] text-[#333333]"
          prefetch={false}>
          Privacy
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:text-[#000080] text-[#333333]"
          prefetch={false}>
          About
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:text-[#000080] text-[#333333]"
          prefetch={false}>
          Contact
        </Link>
      </nav>
    </header>
  );
};

export default Header;