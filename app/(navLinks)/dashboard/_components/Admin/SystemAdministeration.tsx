import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LottieAnimPlayer from "@/components/LottieAnimPlayer";
import lottieAnim from "@/public/dashboard/admin/systemAdmin.json"
import Link from "next/link";

const SystemAdministerationData = {
    title: "System Administration",
    desc: "Manage global settings and monitor system health.",
    animation: lottieAnim,
    className: "h-[300px] overflow-hidden relative",
}

const SystemAdministeration = () => {
  return (
    <div>
      <Link href={"/dashboard/systemAdmin"}>
        <Card className={SystemAdministerationData.className}>
          <CardHeader>
            <CardTitle className="text-primary font-semibold">
              {SystemAdministerationData.title}
            </CardTitle>
            <CardDescription className="font-mono">
              {SystemAdministerationData.desc}
            </CardDescription>
          </CardHeader>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full">
            <LottieAnimPlayer
              lottieAnimation={SystemAdministerationData.animation}
            />
          </div>
        </Card>
      </Link>
    </div>
  );
}

export default SystemAdministeration;
