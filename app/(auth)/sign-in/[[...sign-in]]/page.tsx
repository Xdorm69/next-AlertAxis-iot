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
        <div className="absolute top-8 left-[500px]">
          <LottieAnimPlayer lottieAnimation={lottie1} />
        </div>
        <div className="absolute top-20 right-96">
          <LottieAnimPlayer lottieAnimation={lottie2} />
        </div>
        <div className="absolute bottom-20 right-[400px]">
          <LottieAnimPlayer lottieAnimation={lottie3} />
        </div>
        <div className="absolute bottom-0 left-[450px]">
          <LottieAnimPlayer lottieAnimation={lottie4} />
        </div>
        <div className="absolute bottom-60 left-96">
          <LottieAnimPlayer lottieAnimation={lottie5} />
        </div>
      </div>
      <div className="z-50 relative">
        <SignIn />
      </div>
    </div>
  );
}
