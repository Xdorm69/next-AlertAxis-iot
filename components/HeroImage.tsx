"use client"

import Image from 'next/image'
import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const HeroImage = () => {
    const contRef = useRef<HTMLDivElement>(null);
    useGSAP(() => {
        gsap.fromTo(
          contRef.current,
          {
            y: 30,
            duration: 2,
            repeat: -1,
            yoyo: true,
          },
          {
            y: -30,
            duration: 2,
            repeat: -1,
            yoyo: true,
          }
        );
    }, [contRef])
  return (
    <div ref={contRef} className='img-cont'>
      <Image
        src="/hero.png"
        alt="hero"
        width={600}
        height={400}
        className="hidden md:block"
      />
    </div>
  );
}

export default HeroImage