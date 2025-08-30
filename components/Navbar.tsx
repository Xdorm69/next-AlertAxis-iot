import Link from 'next/link';
import React from 'react'
import { ModeToggle } from './ui/ModeToggle';
import { cn } from '@/lib/utils';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import MobileNavbar from './MobileNavbar';
import AnimatedNavLink from './AnimatedNavLink';

export const navlinks: string[] = ["dashboard", "about"]

const Navbar = () => {
  return (
    <nav className="bg-transparent fixed z-50 backdrop-blur-2xl top-0 left-1/2 -translate-x-1/2 w-full">
      <div className="container mx-auto py-4 px-4 xl:w-7xl">
        <div className="flex items-center justify-between">
          {/* LEFT  */}
          <Link href="/">
            <WebTitle className="text-3xl" />
          </Link>
          {/* RIGHT  */}

          {/* HAMBURGER MENU */}
          <MobileNavbar/>

          {/* FLEX MENU  */}
          <div className="gap-4 items-center font-mono hidden md:flex">
            {navlinks.map((i, id) => {
              return (
                <div
                  className="opacity-50 hover:opacity-100 hover:text-primary transition-colors"
                  key={id}
                >
                  <Link href={`/${i}`}>
                    <AnimatedNavLink word={i} />
                  </Link>
                </div>
              );
            })}
            <ModeToggle />
            <div>
              <SignedOut>
                <SignInButton>
                  <Button className='text-white font-semibold'>Log in</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar

export const WebTitle = ({
  className,
  glow,
}: {
  className?: string;
  glow?: boolean;
}) => {
  return (
    <div className={cn("font-semibold font-sans", className)}>
      <span className={cn("text-primary", glow && "text-shadow-glow text-white/80")}>
        Alert
      </span>
      <span>Axis</span>
    </div>
  );
};