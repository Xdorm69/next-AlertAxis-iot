"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const AnimatedNavLink = ({ word }: { word: string }) => {
  const container = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!container.current) return;

    // Select the two sets of letters
    const navTextTop = container.current.querySelectorAll(
      ".nav-text-top .nav-letters"
    );
    const navTextBottom = container.current.querySelectorAll(
      ".nav-text-bottom .nav-letters"
    );

    // Set the initial state for the bottom text to be hidden below
    gsap.set(navTextBottom, {
      yPercent: 100,
    });

    // Create the timeline
    tl.current = gsap.timeline({ paused: true });

    // Animate both elements simultaneously
    tl.current
      .to(
        navTextTop,
        {
          yPercent: -100,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.06,
        },
        "start"
      )
      .to(
        navTextBottom,
        {
          yPercent: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.06,
        },
        "start"
      );
  }, [word]);

  useLayoutEffect(() => {
    if (hovered) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [hovered]);
  return (
    <div
      ref={container}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex overflow-hidden relative"
    >
      {/* The top word that will animate out */}
      <div className="flex absolute nav-text-top">
        {word.split("").map((letter, idx) => (
          <span key={`top-${idx}`} className="nav-letters block uppercase">
            {letter}
          </span>
        ))}
      </div>

      {/* The bottom word that will animate in */}
      <div className="flex nav-text-bottom">
        {word.split("").map((letter, idx) => (
          <span key={`bottom-${idx}`} className="nav-letters block uppercase">
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnimatedNavLink;
