"use client";

import { useGSAP } from "@gsap/react";
import { MenuIcon } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { navlinks } from "./Navbar";
import Link from "next/link";

const MobileNavbar = () => {
  const mobileNav = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true });

    // Slide in container
    tl.current.from(mobileNav.current, {
      x: "120%",
      filter: "blur(20px)",
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    // Fade in + stagger links
    tl.current.from(
      ".nav-letters",
      {
        opacity: 0,
        y: 10,
        filter: "blur(5px)",
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.06,
      },
      "-=0.2" // overlap a bit with the container animation
    );
  }, []);

  useEffect(() => {
    if (open) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [open]);

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen((prev) => !prev)}>
        <MenuIcon className="size-8 text-foreground" />
      </button>

      <div
        ref={mobileNav}
        className="pb-10 pt-4 bg-card px-4 z-10 absolute right-4 top-16 rounded-xl shadow-lg"
      >
        {navlinks.map((i, id) => (
          <div
            key={id}
            className="mb-2 font-mono text-primary text-right uppercase nav-links"
          >
            <Link href={`/${i}`} onClick={() => setOpen(false)}>
              <div className="flex">
                {i.split("").map((letter, idx) => (
                  <span key={idx} className="nav-letters block">
                    {letter}
                  </span>
                ))}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileNavbar;
