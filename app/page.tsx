import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
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
      <HeroPage />
      <ServicesPage />
      <HowItWorksFlow />
      <PricingPage />
      <TestimonialMarquee />
      <SubscribePage />
    </>
  );
};

export default page;
