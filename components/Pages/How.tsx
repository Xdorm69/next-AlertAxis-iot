"use client";

import { HowItWorksProps, steps } from "@/constants/how";
import AnimatedCircleIcon from "../AnimatedCircleIcon";


export default function HowItWorksFlow() {
  return (
    <section className="w-full my-42 container">
      <h2 className="text-4xl font-bold text-center mb-12 text-accent-foreground">
        🔑 How It Works
      </h2>
      <div className="flex flex-col items-center space-y-8 md:space-y-0 md:flex-row md:justify-center md:space-x-12 px-6">
        {steps.map((step: HowItWorksProps, idx) => (
          <div
            key={step.id}
            className="flex flex-col items-center text-center max-w-[180px] relative"
          >
            {/* Circle Icon */}
            <AnimatedCircleIcon
              icon={step.icon}
            />

            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-full w-24 border-t-2 border-dashed border-gray-400" />
            )}

            {/* Title + Desc */}
            <h3 className="mt-4 font-semibold text-primary">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
