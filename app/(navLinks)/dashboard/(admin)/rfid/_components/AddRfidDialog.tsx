"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// ✅ Validation Schema
const formSchema = z.object({
  tagId: z.string().min(3, "Tag ID must be at least 3 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export function AddRfidDialog() {
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const queryClient = useQueryClient();

  const addRfidMutation = useMutation({
    mutationKey: ["add-rfid"],
    mutationFn: async (data: FormValues) => {
      const res = await fetch("/api/rfid/add-rfid", {
        method: "POST",
        body: JSON.stringify({
          tagId: data.tagId,
        }),
      });
      const resData = await res.json();
      if (!resData.success) throw resData;
      return resData;
    },
    onMutate: () => {
      toast.loading("Adding rfid...", { id: "add-rfid" });
    },
    onSuccess: () => {
      toast.success("Rfid added successfully", { id: "add-rfid" });
      queryClient.invalidateQueries({ queryKey: ["rfid-data-all"] });
    },
    onError: (data: { error: string }) => {
      toast.error(data.error, { id: "add-rfid" });
    },
  });

  const submitHandler = async (data: FormValues) => {
    addRfidMutation.mutate(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="border-1 border-emerald-200 bg-emerald-600 hover:bg-emerald-700 text-white">
          Add RFID
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add RFID</DialogTitle>
          <DialogDescription>
            Provide Tag ID to register a new RFID.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          {/* Tag ID */}
          <div>
            <Label htmlFor="tagId">Tag ID</Label>
            <Input
              id="tagId"
              placeholder="Enter RFID Tag ID"
              className="mt-2"
              {...register("tagId")}
            />
            {errors.tagId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.tagId.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>Close</Button>
            </DialogClose>
            <Button
              type="submit"
              className="text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add RFID"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
