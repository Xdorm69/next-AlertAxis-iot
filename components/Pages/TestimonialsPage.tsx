"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { testimonials } from "@/constants/testimonials";


export default function TestimonialMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const totalWidth = marquee.scrollWidth;

    gsap.to(marquee, {
      x: -totalWidth / 2,
      duration: 20,
      ease: "linear",
      repeat: -1,
    });
  }, []);

  return (
    <section className="w-full my-42 bg-background ">
      <h2 className="text-4xl font-bold text-center mb-12 text-accent-foreground">
        🌟 What Our Users Say
      </h2>

      {/* Masked parent container */}
      <div className="relative w-full overflow-hidden">
        <div
          className="container xl:w-7xl py-4 overflow-hidden mx-auto"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: "100% 100%",
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            maskRepeat: "no-repeat",
            maskSize: "100% 100%",
          }}
        >
          <div ref={marqueeRef} className="flex space-x-8 w-max">
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div
                key={idx}
                className="min-w-[350px] bg-card shadow-lg rounded-2xl p-6 border border-card"
              >
                <p className="italic mb-4">“{t.text}”</p>
                <div className="flex gap-2 items-center">
                  <div>
                    <h4 className="text-lg font-semibold">{t.name}</h4>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                  <div className="rounded-full size-12 overflow-hidden" >
                    <Image
                      src={t.img}
                      alt={t.name}
                      width={50}
                      height={50}
                      className="bg-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
