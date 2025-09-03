"use client";

import { useState } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function DeleteUserDialog({ clerkId }: { clerkId: string }) {
  const [secretKey, setSecretKey] = useState("");

  async function deleteUser(clerkId: string, secretKey: string) {
    const res = await fetch(`/api/users/${clerkId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: secretKey }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw data;
    }
    return data;
  }

  const queryClient = useQueryClient();

  const mutatation = useMutation({
    mutationFn: ({
      clerkId,
      secretKey,
    }: {
      clerkId: string;
      secretKey: string;
    }) => deleteUser(clerkId, secretKey),

    onMutate: () => {
      toast.loading("Deleting user", { id: `delete-user-${clerkId}` });
    },

    onSuccess: (data) => {
      toast.success(data.message || "User deleted successfully", {
        id: `delete-user-${clerkId}`,
      });
      // Invalidate any queries that may need refresh (like users list)
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (data: any) => {
      toast.error(data.error || "Something went wrong", {
        id: `delete-user-${clerkId}`,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Delete User
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Please enter the secret key to confirm
            deletion of this user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          <Input
            type="password"
            placeholder="Enter secret key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={() => mutatation.mutate({ clerkId, secretKey })}
              disabled={mutatation.isPending || !(secretKey.trim())}
            >
              {mutatation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
