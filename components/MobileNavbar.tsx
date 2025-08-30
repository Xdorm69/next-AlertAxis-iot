"use client";

import { MenuIcon } from "lucide-react";
import React, { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { navlinks } from "./Navbar";
import Link from "next/link";
import { useGSAP } from "@gsap/react";

const MobileNavbar = () => {
  const mobileNav = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!mobileNav.current) return;

    // Initialize timeline
    tl.current = gsap.timeline({ paused: true });

    // Set initial state of container
    gsap.set(mobileNav.current, {
      x: "120%",
      opacity: 0,
      pointerEvents: "none",
    });

    // Set initial state of letters
    gsap.set(mobileNav.current.querySelectorAll(".nav-letters"), {
      opacity: 0,
      y: 10,
      filter: "blur(5px)",
    });

    // Animate container
    tl.current.to(mobileNav.current, {
      x: "0%",
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.5,
      ease: "power2.out",
      pointerEvents: "auto",
    });

    // Animate letters
    tl.current.to(
      mobileNav.current.querySelectorAll(".nav-letters"),
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.06,
      },
      "-=0.3"
    );
  }, []);

  // Play/reverse timeline on toggle
  useLayoutEffect(() => {
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
        className="pb-10 pt-4 bg-card px-4 z-10 absolute right-4 top-16 rounded-xl shadow-lg opacity-0"
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
