"use client";

import { CheckCircle, Database, Key, LogIn, Monitor } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Tap RFID Card",
    desc: "Place your RFID tag near the reader.",
    icon: <LogIn className="w-8 h-8 text-blue-600" />,
  },
  {
    id: 2,
    title: "Authenticate User",
    desc: "System checks if card is valid in database.",
    icon: <Key className="w-8 h-8 text-green-600" />,
  },
  {
    id: 3,
    title: "Grant or Deny Access",
    desc: "Door unlocks instantly if authorized.",
    icon: <CheckCircle className="w-8 h-8 text-emerald-600" />,
  },
  {
    id: 4,
    title: "Save Log",
    desc: "Entry recorded securely in database.",
    icon: <Database className="w-8 h-8 text-purple-600" />,
  },
  {
    id: 5,
    title: "View Dashboard",
    desc: "Monitor logs anytime in real-time.",
    icon: <Monitor className="w-8 h-8 text-orange-600" />,
  },
];

export default function HowItWorksFlow() {
  return (
    <section className="w-full my-42 container">
      <h2 className="text-4xl font-bold text-center mb-12 text-accent-foreground">🔑 How It Works</h2>
      <div className="flex flex-col items-center space-y-8 md:space-y-0 md:flex-row md:justify-center md:space-x-12 px-6">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className="flex flex-col items-center text-center max-w-[180px] relative"
          >
            {/* Circle Icon */}
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md border">
              {step.icon}
            </div>

            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-full w-24 border-t-2 border-dashed border-gray-400"/>
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
