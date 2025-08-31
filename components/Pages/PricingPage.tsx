"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "₹499/month",
    description: "Perfect for home users & small-scale IoT projects.",
    features: [
      "1 RFID Reader + ESP8266 Integration",
      "Up to 5 User RFID Cards",
      "Basic Access Logs (last 30 transactions)",
      "Email Support",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹999/month",
    description: "Best for startups, shops, and small businesses.",
    features: [
      "3 RFID Readers + ESP8266 Integration",
      "Up to 25 User RFID Cards",
      "Real-time Access Logs & Dashboard",
      "Admin Card Reissue Functionality",
      "Priority Email & Chat Support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Advanced solution for large-scale offices & industries.",
    features: [
      "Unlimited RFID Readers",
      "Unlimited User RFID Cards",
      "Advanced Analytics & Monitoring",
      "Role-Based Access Control",
      "Dedicated Account Manager",
      "24/7 Support",
    ],
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <section className="w-full my-42 bg-background">
      <h2 className="text-4xl font-bold text-center mb-6 text-accent-foreground">
        💳 Pricing Plans
      </h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12 font-mono">
        Choose the right plan for your RFID-based home & business security.
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl shadow-md p-8 flex flex-col border ${
              plan.highlighted
                ? "bg-accent border-ring scale-105"
                : "bg-card border-card"
            }`}
          >
            <h3 className="text-2xl font-mono font-bold mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold text-primary mb-4">{plan.price}</p>
            <p className="text-muted-foreground/60 mb-6 font-mono">
              {plan.description}
            </p>

            <ul className="space-y-3 flex-1">
              {plan.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center space-x-2 text-muted-foreground"
                >
                  <CheckCircle2 className="text-green-500 w-5 h-5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/payment">
              <Button
                className={`mt-8 w-full py-3 cursor-pointer rounded-xl font-semibold transition ${
                  plan.highlighted
                    ? "bg-primary text-white hover:bg-primary/80"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
