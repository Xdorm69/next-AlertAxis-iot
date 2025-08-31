import { SignIn } from "@clerk/nextjs";
import lottie1 from "@/public/services/db2.json"
import lottie2 from "@/public/services/real2.json"
import lottie3 from "@/public/services/rfid.json"
import lottie4 from "@/public/services/db.json"
import lottie5 from "@/public/services/real.json"
import LottieAnimPlayer from "@/components/LottieAnimPlayer";

export default function Page() {
  return (
    <div className="flex items-center justify-center w-full h-screen relative">
      <div className="w-[30vw] h-[30vw] bg-primary/70 blur-3xl rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="z-30">
        <div className="absolute top-8 md:left-[32rem]">
          <LottieAnimPlayer lottieAnimation={lottie1} />
        </div>
        <div className="hidden md:flex absolute top-20 left-1/2">
          <LottieAnimPlayer lottieAnimation={lottie2} />
        </div>
        <div className="absolute bottom-10 right-5 md:bottom-20 md:right-[25rem]">
          <LottieAnimPlayer lottieAnimation={lottie3} />
        </div>
        <div className="hidden md:flex absolute bottom-0 right-1/2">
          <LottieAnimPlayer lottieAnimation={lottie4} />
        </div>
        <div className="hidden md:flex absolute bottom-60 left-1/4">
          <LottieAnimPlayer lottieAnimation={lottie5} />
        </div>
      </div>
      <div className="z-40 relative">
        <SignIn />
      </div>
    </div>
  );
}
