import HeroPage from "@/components/Pages/HeroPage";
import HowItWorksFlow from "@/components/Pages/How";
import PricingPage from "@/components/Pages/PricingPage";
import ServicesPage from "@/components/Pages/ServicesPage";
import SubscribePage from "@/components/Pages/SubscribePage";
import TestimonialMarquee from "@/components/Pages/TestimonialsPage";
import React from "react";
import AnimatedBg from "@/components/AnimatedBg";

const page = () => {
  return (
    <>
      <AnimatedBg />
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
