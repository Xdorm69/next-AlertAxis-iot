import HeroPage from "@/components/Pages/HeroPage";
import HowItWorksFlow from "@/components/Pages/How";
import PricingPage from "@/components/Pages/PricingPage";
import ServicesPage from "@/components/Pages/ServicesPage";
import SubscribePage from "@/components/Pages/SubscribePage";
import TestimonialMarquee from "@/components/Pages/TestimonialsPage";
import React from "react";

const page = () => {
  return (
    <>
      <div className="bg-primary/80 md:bg-primary/40 blur-3xl rounded-full size-[20vw] absolute right-5 md:right-0" />
      <div className="z-10">
        <HeroPage />
        <ServicesPage />
        <HowItWorksFlow />
        <PricingPage />
        <TestimonialMarquee />
        <SubscribePage />
      </div>
    </>
  );
};

export default page;
