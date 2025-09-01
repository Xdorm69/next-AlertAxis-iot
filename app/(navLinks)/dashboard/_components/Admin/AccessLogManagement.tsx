import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LottieAnimPlayer from "@/components/LottieAnimPlayer";
import lottieAnim from "@/public/dashboard/admin/accessLogs.json";

const AccessLogManagement = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Card className="h-[300px] overflow-hidden relative">
            <CardHeader>
              <CardTitle className="text-primary font-semibold">
                Access Logs 📜
              </CardTitle>
              <CardDescription className="font-mono">
                View and filter system access history.
              </CardDescription>
            </CardHeader>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full scale-120">
              <LottieAnimPlayer lottieAnimation={lottieAnim} />
            </div>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Basic Dialog</DialogTitle>
            <DialogDescription>
              This is a placeholder dialog. Update its content based on your
              needs.
            </DialogDescription>
          </DialogHeader>

          {/* Custom content goes here */}
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Replace this with your form, actions, or details.
            </p>
          </div>

          <DialogFooter>
            <Button variant="secondary">Cancel</Button>
            <Button variant="default">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessLogManagement;
