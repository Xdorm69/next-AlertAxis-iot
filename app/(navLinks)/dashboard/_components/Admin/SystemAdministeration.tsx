import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LottieAnimPlayer from "@/components/LottieAnimPlayer";
import lottieAnim from "@/public/dashboard/admin/systemAdmin.json"

const SystemAdministerationData = {
    title: "System Administration",
    desc: "Manage global settings and monitor system health.",
    animation: lottieAnim,
    className: "h-[300px] overflow-hidden relative",
}

const SystemAdministeration = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
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
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{SystemAdministerationData.title}</DialogTitle>
            <DialogDescription>
              {SystemAdministerationData.desc}
            </DialogDescription>
          </DialogHeader>

          {/* Custom content goes here */}
          <div className="py-4">
            <p className="text-sm text-muted-foreground">{SystemAdministerationData.title} Coming Soon...</p>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SystemAdministeration;
