"use client";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef } from 'react'

const AnimatedBg = () => {
    const bgRef = useRef<HTMLDivElement>(null);
    useGSAP(() => {
        gsap.to(bgRef.current, {
            y: "100%",
            yoyo: true,
            repeat: -1,
            duration: 15,
            ease: "power1.inOut",
        })
    }, [])
    
  return (
    <div ref={bgRef} className="bg-primary/80 md:bg-primary/40 blur-3xl rounded-full size-[20vw] absolute right-5 md:right-0" />
  );
}

export default AnimatedBg