
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LottieAnimPlayer from "@/components/LottieAnimPlayer";
import lottieAnim from "@/public/dashboard/admin/rfid.json";
import Link from "next/link";

const RfidAndDeviceManagement = () => {
  return (
    <div>
      <Link href={"/dashboard/rfid"}>
        <Card className="h-[300px] overflow-hidden relative">
          <CardHeader>
            <CardTitle className="text-primary font-semibold">
              RFID & Devices 📡
            </CardTitle>
            <CardDescription className="font-mono">
              Configure RFID tags and connected devices.
            </CardDescription>
          </CardHeader>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full scale-120">
            <LottieAnimPlayer lottieAnimation={lottieAnim} />
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default RfidAndDeviceManagement;
