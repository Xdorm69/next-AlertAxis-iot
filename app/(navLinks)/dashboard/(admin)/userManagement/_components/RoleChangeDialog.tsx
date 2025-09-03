"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RoleChangeDialog({
  currentRole,
  clerkId,
}: {
  currentRole: "USER" | "ADMIN";
  clerkId: string;
}) {
  const [open, setOpen] = useState(false);
  const [secret, setSecret] = useState("");

  const queryClient = useQueryClient();

  const changeUserRoleMutation = useMutation({
    mutationKey: ["change-user-status", clerkId],
    mutationFn: async ({
      role,
      secret,
    }: {
      role: "USER" | "ADMIN";
      secret?: string;
    }) => {
      const res = await fetch(`/api/users/${clerkId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role, secret }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to apply change");
      }

      return res.json();
    },
    onMutate: () => {
      toast.loading("Applying change...", { id: "role-change" });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [clerkId, "user-data"] });
      queryClient.invalidateQueries({ queryKey: ["users-data"] });
      toast.success(data.message || "Change applied", { id: "role-change" });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to apply change", {
        id: "role-change",
      });
    },
    onSettled: () => {
      setSecret("");
      setOpen(false);
    },
  });

  const handleConfirm = () => {
    const newRole = currentRole === "USER" ? "ADMIN" : "USER";
    changeUserRoleMutation.mutate({ role: newRole, secret });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Change Role</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change User Role</AlertDialogTitle>
          <AlertDialogDescription>
            {currentRole === "USER"
              ? "Do you want to promote this user to ADMIN?"
              : "Demoting an ADMIN to USER requires the secret key."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {currentRole === "ADMIN" && (
          <Input
            type="password"
            placeholder="Enter secret key"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="my-4"
          />
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
            className="text-white"
              onClick={handleConfirm}
              disabled={changeUserRoleMutation.isPending}
            >
              {changeUserRoleMutation.isPending ? "Applying..." : "Confirm"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
