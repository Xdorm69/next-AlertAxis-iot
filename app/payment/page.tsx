"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PricingPlans, PricingPlansProps } from "@/constants/pricing";

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlansProps>(
    PricingPlans[0]
  );
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ keep a reference to the form element
    const formEl = e.currentTarget;

    const formData = new FormData(formEl);
    // const name = formData.get("name") as string;
    // const email = formData.get("email") as string;
    // const card = formData.get("card") as string;

    toast.loading("Processing your payment...", { id: "pay" });

    const t = setTimeout(() => {
      // ✅ reset using saved reference
      formEl.reset();

      toast.success(
        selectedPlan.name === "Enterprise"
          ? "Our sales team will reach out to you soon!"
          : "Payment successful!",
        { id: "pay" }
      );
      router.push("/dashboard");
    }, 2000);

    // cleanup timeout in case of navigation/unmount
    window.addEventListener("beforeunload", () => clearTimeout(t));
  };

  return (
    <div className="min-h-screen my-18 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-4xl w-full h-full grid md:grid-cols-2 gap-8">
        {/* Plans */}
        <div>
          <h1 className="text-3xl font-bold mb-6 text-foreground">Choose Your Plan</h1>
          <div className="space-y-4">
            {PricingPlans.map((plan: PricingPlansProps) => (
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
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
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
        <div className="bg-gray-900 h-full p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Checkout</h2>
          <p className="text-muted-foreground mb-6">
            Selected Plan:{" "}
            <span className="text-yellow-400 font-semibold font-mono">
              {selectedPlan.name}
            </span>
          </p>
          <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name" className="mb-2">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="card" className="mb-2">
                Card Details
              </Label>
              <Input
                id="card"
                required
                placeholder="1234 5678 9012 3456"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-yellow-500 text-white font-semibold hover:bg-yellow-400"
            >
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
