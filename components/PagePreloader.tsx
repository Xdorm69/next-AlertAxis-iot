"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [demoVals, setDemoVals] = useState<number[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  // Generate values only once
  const generateDemoVals = (): number[] => {
    const temp: number[] = [];
    for (let i = 0; i < 10; i++) {
      const base = i * 10;
      const offset = i === 0 || i === 9 ? 0 : Math.floor(Math.random() * 10);
      temp.push(base + offset);
    }
    temp[0] = 0;
    temp[9] = 100;
    return temp;
  };

  useEffect(() => {
    setDemoVals(generateDemoVals());
  }, []);

  const isSingleDigitNumber = (num: number): boolean => num < 10;

  useGSAP(() => {
    if (
      !containerRef.current ||
      !counterRef.current ||
      !maskRef.current ||
      demoVals.length === 0
    )
      return;

    const container = containerRef.current;
    const el = counterRef.current;
    const mask = maskRef.current;
    const distance = `-${el.clientHeight - mask.clientHeight}px`;

    // ✅ SETUP
    gsap.set(mask, { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" });
    gsap.set(".hero-letter", { y: "100%" });
    gsap.set(container, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    });
    gsap.set(el, { y: `${mask.clientHeight}px` });
    gsap.set(".hero-text", { x: "-100%" });
    gsap.set(".strip", { width: 0, x: "-120px" });

    // ✅ Infinite strip animations
    gsap.utils.toArray<HTMLElement>(".strip h1").forEach((el) => {
      gsap.to(el, {
        repeat: -1,
        ease: "linear",
        x: "-100%",
        duration: 6,
      });
    });

    // ✅ Timeline
    const tl = gsap.timeline({ onComplete: () => setLoading(false) });
    tl.to(".strip.first", { width: "150vw", duration: 1 })
      .to(".strip.second", { delay: 0.4, width: "150vw", duration: 1 }, "<")
      .to(".hero-text", { x: "0%", duration: 1 })
      .to(".hero-letter", { y: "0%", stagger: 0.1, duration: 0.6 }, "-=0.6")
      .to(
        mask,
        {
          delay: 0.2,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          ease: "power4.inOut",
          duration: 0.9,
        },
        "<"
      )
      .to(
        el,
        {
          duration: 2.5,
          y: distance,
          ease: "power1.inOut",
        },
        "-=0.44"
      )
      .to(container, {
        clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
        duration: 1.3,
        ease: "power2.inOut",
      });
  }, [demoVals]);

  if (!loading) return null;

  return (
    <div
      ref={containerRef}
      className="z-50 w-full h-screen absolute top-0 left-0 bg-background font-mono overflow-hidden"
    >
      <div className="relative w-full h-full">
        {/* HERO TEXT */}
        <div className="absolute hidden lg:block z-30 top-40 left-5">
          <div className="overflow-hidden">
            <div className="hero-text text-[12rem] bg-card shadow-2xl px-8 rounded-xl flex font-bold tracking-tighter">
              {"ALERTAXIS".split("").map((i, id) => (
                <span key={id} className="hero-letter">
                  {i}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* TEXT STRIP */}
        <div>
          <div className="strip first py-6 top-[30rem] -rotate-18 bg-primary absolute z-20 text-white text-[8rem] overflow-hidden">
            <h1 className="whitespace-nowrap pr-2">
              alert alert alert alert alert alert alert alert
            </h1>
          </div>
          <div className="strip second py-6 top-[6rem] shadow-2xl rotate-24 bg-accent-foreground absolute z-20 text-white text-[8rem] overflow-hidden">
            <h1 className="whitespace-nowrap pr-2">
              axis axis axis axis axis axis axis axis axis
            </h1>
          </div>
        </div>

        {/* COUNTER */}
        <div className="absolute right-1/2 translate-x-1/2 lg:right-5 lg:translate-x-0 bottom-5 z-30">
          <div className="overflow-hidden rounded-xl">
            <div
              ref={maskRef}
              className="text-masker bg-card rounded-xl w-fit h-[14rem] lg:h-[18rem] overflow-hidden text-[9.5rem] lg:text-[12rem] z-20"
            >
              <div
                ref={counterRef}
                className="flex flex-col w-fit text-center font-bold px-10"
              >
                {demoVals.map((i) => (
                  <span key={i}>{isSingleDigitNumber(i) ? "0" + i : i}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
