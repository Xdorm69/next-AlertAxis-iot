import Link from 'next/link';
import React from 'react'
import { ModeToggle } from './ui/ModeToggle';
import { MenuIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const navlinks = ["shop", "service", "about"]

const Navbar = () => {
  return (
    <nav className="bg-transparent fixed z-10 backdrop-blur-2xl top-0 left-1/2 -translate-x-1/2 w-full">
      <div className="container mx-auto py-4 px-4 xl:w-7xl">
        <div className="flex items-center justify-between">
          {/* LEFT  */}
          <Link href="/">
            <WebTitle className='text-3xl' />
          </Link>
          {/* RIGHT  */}

          {/* HAMBURGER MENU */}
          <div className="md:hidden">
            <MenuIcon className="size-8 text-foreground " />
          </div>

          {/* FLEX MENU  */}
          <div className="gap-4 items-center font-mono hidden md:flex">
            {navlinks.map((i, id) => {
              return (
                <div className='opacity-50 hover:opacity-100 hover:text-primary transition' key={id}>
                  <Link href={i}>{i.toUpperCase()}</Link>
                </div>
              );
            })}
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar

export const WebTitle = ({className}: {className?: string}) => {
  return (
    <div className={cn("font-semibold font-sans", className)}>
      <span className="text-primary">Alert</span>
      <span>Axis</span>
    </div>
  );
}