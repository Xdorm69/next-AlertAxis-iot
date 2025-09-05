"use client";
import React, { useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import LottieAnimPlayer from "../LottieAnimPlayer";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { CardData, ServiceCardProps } from "@/constants/services";

gsap.registerPlugin(ScrollTrigger);

const ServicesPage = () => {
  const container = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!container.current) return;

    const mobile = window.innerHeight > window.innerWidth;

    gsap.fromTo(
      container.current.querySelectorAll(".service-card"),
      {
        ...(mobile ? { x: 40 } : { y: 40 }),

        opacity: 0,
      },
      {
        ...(mobile ? { x: 0 } : { y: 0 }),

        opacity: 1,
        stagger: 0.5,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true,
        },
      }
    );
  }, []);
  return (
    <section className="my-20">
      <div className="container mx-auto py-4 px-4 xl:w-7xl overflow-hidden">
        <div>
          <h1 className="text-4xl text-center font-semibold mb-6 text-accent-foreground">
            📦 Services
          </h1>
          <p className="text-center font-mono text-muted-foreground max-w-2xl mx-auto mb-12">
            Stay safe with RFID access control, real-time monitoring, and secure
            database solutions. Choose the right plan.
          </p>
        </div>
        <div
          ref={container}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        >
          {CardData.map((i: ServiceCardProps, id) => {
            return (
              <ServiceCard
                key={id}
                title={i.title}
                desc={i.desc}
                className={i?.className}
                animation={i.animation}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;

const ServiceCard = ({
  title,
  desc,
  animation,
  className,
}: ServiceCardProps) => {
  return (
    <div className="service-card">
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle className="text-primary font-semibold text-2xl">
            {title}
          </CardTitle>
          <CardDescription className="font-mono text-muted-foreground">
            {desc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LottieAnimPlayer className={className} lottieAnimation={animation} />
        </CardContent>
      </Card>
    </div>
  );
};
