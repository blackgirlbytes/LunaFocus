import React from 'react';

const Header = () => {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-[#E6E6FA] shadow-md">
      <a className="flex items-center justify-center" href="/#">
        <svg className="h-6 w-6 text-[#000080]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12h.01"></path>
          <path d="M15 12h.01"></path>
          <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"></path>
          <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path>
        </svg>
        <span className="sr-only">LunaFocus</span>
      </a>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <a className="text-sm font-medium hover:text-[#000080] text-[#333333]" href="/#">Features</a>
        <a className="text-sm font-medium hover:text-[#000080] text-[#333333]" href="/#">Privacy</a>
        <a className="text-sm font-medium hover:text-[#000080] text-[#333333]" href="/#">About</a>
        <a className="text-sm font-medium hover:text-[#000080] text-[#333333]" href="/#">Contact</a>
      </nav>
    </header>
  );
};

export default Header;