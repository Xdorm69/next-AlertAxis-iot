import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LottieAnimPlayer from "@/components/LottieAnimPlayer";
import lottieAnim from "@/public/dashboard/admin/userManagement.json";
import Link from "next/link";

const UserManagementData = {
  title: "User Management 👥",
  desc: "Add, edit, and manage users & roles.",
  lottieAnim: lottieAnim,
};

const UserManagement = () => {
  return (
    <div>
      <Link href={"/dashboard/userManagement"}>
        <Card className="h-[300px] overflow-hidden relative hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-primary font-semibold">
              {UserManagementData.title}
            </CardTitle>
            <CardDescription className="font-mono">
              {UserManagementData.desc}
            </CardDescription>
          </CardHeader>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full scale-110">
            <LottieAnimPlayer lottieAnimation={UserManagementData.lottieAnim} />
          </div>
        </Card>
      </Link>
    </div>
  );
};


export default UserManagement;
