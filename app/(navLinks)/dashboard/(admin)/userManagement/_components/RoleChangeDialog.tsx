"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";


export default function RoleChangeDialog({
  currentRole,
  onConfirm,
}: {
  currentRole: "USER" | "ADMIN";
  onConfirm: (data: { role: "USER" | "ADMIN"; secret?: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [secret, setSecret] = useState("");

  const handleConfirm = () => {
    const newRole = currentRole === "USER" ? "ADMIN" : "USER";
    onConfirm({
      role: newRole,
      secret: currentRole === "ADMIN" ? secret : undefined,
    });
    setSecret("");
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="text-white">Change Role</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {currentRole === "USER"
              ? "Promote User to Admin"
              : "Admin Verification Required"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {currentRole === "USER" ? (
              <>
                ⚠️ <strong>Warning:</strong> This user will be promoted to{" "}
                <span className="font-bold text-red-600">Admin</span>. Please
                confirm if you want to continue.
              </>
            ) : (
              <>
                To confirm, please enter the secret passphrase for admin
                changes.
                <Input
                  type="password"
                  placeholder="Enter secret"
                  className="mt-2"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                />
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="text-white"
            onClick={handleConfirm}
            disabled={currentRole === "ADMIN" && !secret.trim()}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
