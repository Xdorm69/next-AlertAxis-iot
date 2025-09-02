"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schema = z.object({
  username: z.string().min(6, "Username must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]),
  secretKey: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function UsernameField({ form }: { form: any }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Username</label>
      <Input placeholder="johndoe" {...form.register("username")} />
      {form.formState.errors.username && (
        <p className="text-red-500 text-sm mt-1">
          {form.formState.errors.username.message}
        </p>
      )}
    </div>
  );
}

function PhoneField({ form }: { form: any }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 ">
        Phone (optional)
      </label>
      <Input placeholder="+91 98765 43210" {...form.register("phone")} />
    </div>
  );
}

function RoleField({ form }: { form: any }) {
  return (
    <div>
      <Label className="font-medium mb-2">Role</Label>
      <Controller
        name="role"
        control={form.control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}

function ConfirmationDialog({
  role,
  form,
}: {
  role: "USER" | "ADMIN";
  form: any;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full text-white font-semibold">Submit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form>
          <DialogHeader>
            <DialogTitle>
              {role === "USER" ? "User Onboarding" : "Admin Request"}
            </DialogTitle>
            <DialogDescription>
              {role === "USER"
                ? "Make sure to confirm all your details."
                : "Your request for admin access will be submitted."}
            </DialogDescription>
          </DialogHeader>

          {role === "ADMIN" && (
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label>Secret Key</Label>
                <Input
                  id="secret-key"
                  type="password"
                  autoComplete="off"
                  placeholder="Enter admin secret key"
                  {...form.register("secretKey")}
                />
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={() => setOpen(false)}
              disabled={role === "ADMIN" && !form.watch("secretKey")}
              className="text-white"
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function OnboardForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      phone: "",
      role: "USER",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    toast.loading("Submitting form...", { id: "onboard" });
    const res = await fetch("/api/onboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      toast.success("Form submitted", { id: "onboard" });
      router.push("/dashboard");
    } else {
      toast.error(result.error || "Form submission failed", { id: "onboard" });
    }
    form.reset();
    setLoading(false);
  };

  const selectedRole = form.watch("role");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <UsernameField form={form} />
      <PhoneField form={form} />
      <RoleField form={form} />
      <ConfirmationDialog role={selectedRole} form={form} />
    </form>
  );
}
