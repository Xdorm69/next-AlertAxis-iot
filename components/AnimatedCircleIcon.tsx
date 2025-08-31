"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";

const AnimatedCircleIcon = ({ icon }: { icon: ReactNode }) => {
    const iconRef = useRef<HTMLDivElement>(null);
    const tl = useRef<gsap.core.Timeline | null>(null);
    useGSAP(() => {
        if (!iconRef.current) return;
        

        tl.current = gsap.timeline({paused: true})
        gsap.set(iconRef.current, {
            scale: 1,
            rotate: 0,
        })
        tl.current.to(iconRef.current, {
            rotate: 360,
            ease: "expo.inOut",
            scale: 1.2,
            boxShadow: "0 0 5px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5)",
            duration: .5,
        })
    }, [])

    const [mouseEnter, setMouseEnter] = useState(false);

  useEffect(() => {
    const handleEnter = () => setMouseEnter(true);
    const handleLeave = () => setMouseEnter(false);

    const node = iconRef.current;
    if (node) {
      node.addEventListener("mouseenter", handleEnter);
      node.addEventListener("mouseleave", handleLeave);
    }

    return () => {
      if (node) {
        node.removeEventListener("mouseenter", handleEnter);
        node.removeEventListener("mouseleave", handleLeave);
      }
    };
  }, []);

    useLayoutEffect(() => {
        if(mouseEnter) {
            tl.current?.play();
        } else {
            tl.current?.reverse();
        }
    }, [mouseEnter]);


  return (
    <div ref={iconRef} className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md border">
      {icon}
    </div>
  );
};

export default AnimatedCircleIcon;
