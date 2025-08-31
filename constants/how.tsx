import { CheckCircle, Database, Key, LogIn, Monitor } from "lucide-react";
import { JSX } from "react";

export type HowItWorksProps = {
    id: number;
    title: string;
    desc: string;
    icon: JSX.Element;
}

export const steps: HowItWorksProps[] = [
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
