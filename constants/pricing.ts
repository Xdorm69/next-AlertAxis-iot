export type PricingPlansProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted: boolean;
};
export const PricingPlans: PricingPlansProps[] = [
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
