"use client";
import { useGSAP } from "@gsap/react";
import React, { useRef } from "react";
import gsap from "gsap";

const AnimatedHand = () => {
  const hand = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(
      hand.current,
      { rotate: 10, scale: 1 },
      {
        rotate: -10,
        scale: 1.2,
        duration: 0.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      }
    );
  }, []);
  return <div className="hidden md:block" ref={hand}>👋</div>;
};

export default AnimatedHand;
