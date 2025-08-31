"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const plans = [
  {
    name: "Starter",
    price: "₹499/month",
    features: [
      "1 RFID Reader + ESP8266 Integration",
      "Up to 5 User RFID Cards",
      "Basic Access Logs (last 30 transactions)",
      "Email Support",
    ],
  },
  {
    name: "Pro",
    price: "₹999/month",
    features: [
      "3 RFID Readers + ESP8266 Integration",
      "Up to 25 User RFID Cards",
      "Real-time Access Logs & Dashboard",
      "Admin Card Reissue Functionality",
      "Priority Email & Chat Support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Unlimited RFID Readers",
      "Unlimited User RFID Cards",
      "Advanced Analytics & Monitoring",
      "Role-Based Access Control",
      "Dedicated Account Manager",
      "24/7 Support",
    ],
  },
];

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  return (
    <div className="min-h-screen bg-black my-18 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        {/* Plans */}
        <div>
          <h1 className="text-3xl font-bold mb-6">Choose Your Plan</h1>
          <div className="space-y-4">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`cursor-pointer transition-all ${
                  selectedPlan.name === plan.name
                    ? "border-2 border-yellow-400"
                    : "border border-gray-800"
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center font-mono text-2xl font-bold">
                    {plan.name}
                    <span className="text-yellow-400 font-semibold text-lg">
                      {plan.price}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {plan.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Checkout Form */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Checkout</h2>
          <p className="text-gray-400 mb-6">
            Selected Plan:{" "}
            <span className="text-yellow-400 font-semibold font-mono">
              {selectedPlan.name}
            </span>
          </p>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name" className="mb-2">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="card" className="mb-2">Card Details</Label>
              <Input
                id="card"
                placeholder="1234 5678 9012 3456"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button className="w-full bg-yellow-500 text-white font-semibold hover:bg-yellow-400">
              {selectedPlan.name === "Enterprise"
                ? "Contact Sales"
                : "Confirm & Pay"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
