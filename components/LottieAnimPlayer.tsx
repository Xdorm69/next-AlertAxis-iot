"use client"
import { cn } from "@/lib/utils";
import Lottie from "lottie-react";

type LottieAnimProps = {
  lottieAnimation: object;
  className?: string;
};

export default function LottieAnimPlayer({
  lottieAnimation,
  className,
}: LottieAnimProps) {
  return (
    <div className="py-2 ">
      <Lottie animationData={lottieAnimation} className={cn("w-full h-62", className)} loop={true} />
    </div>
  );
}
