"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ✅ Validation Schema
const formSchema = z.object({
  tagId: z.string().min(3, "Tag ID must be at least 3 characters"),
  userId: z.string().min(1, "User is required"),
  active: z.enum(["true", "false"]),
});

type FormValues = z.infer<typeof formSchema>;

export function AddRfidDialog() {
  const [open, setOpen] = React.useState(false);
  const [userPopoverOpen, setUserPopoverOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      active: "false",
    },
  });

  // 🔹 Debounced query
  const [debouncedQuery, setDebouncedQuery] = React.useState("");

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const queryClient = useQueryClient();

  // 🔹 Fetch users with useQuery
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", debouncedQuery],
    queryFn: async () => {
      const res = await fetch(`/api/rfid/users?query=${debouncedQuery}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const json = await res.json();
      return json.data as { id: string; username: string }[];
    },
  });

  const addRfidMutation = useMutation({
    mutationKey: ["add-rfid"],
    mutationFn: async (data: FormValues) => {
      const res = await fetch("/api/rfid/add-rfid", {
        method: "POST",
        body: JSON.stringify({
          tagId: data.tagId,
          userId: data.userId,
          status: data.active,
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
    setSelectedUser(null);
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
            Provide Tag ID, assign to a User, and set its active status.
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

          {/* User Combobox */}
          <div>
            <Label>User</Label>
            <Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={userPopoverOpen}
                  className={cn(
                    "w-full justify-between mt-2",
                    !selectedUser && "text-muted-foreground"
                  )}
                >
                  {selectedUser
                    ? users.find((u) => u.id === selectedUser)?.username
                    : "Select user..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)] p-0">
                <Command className="w-full">
                  <CommandInput
                    className="w-full"
                    placeholder="Search user..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList className="w-full">
                    {isLoading && <CommandEmpty>Loading...</CommandEmpty>}
                    {!isLoading && users.length === 0 && (
                      <CommandEmpty>No users found.</CommandEmpty>
                    )}
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.username} // ✅ pass username as value
                        onSelect={() => {
                          setValue("userId", user.id, {
                            shouldValidate: true,
                            shouldDirty: true,
                          }); // ✅ update form
                          setSelectedUser(user.id);
                          setUserPopoverOpen(false);
                        }}
                      >
                        {user.username}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.userId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.userId.message}
              </p>
            )}
          </div>

          {/* Active Status Select */}
          <div>
            <Label>Status</Label>
            <Select
              defaultValue="false"
              onValueChange={(val: "true" | "false") => setValue("active", val)}
            >
              <SelectTrigger className="mt-2 w-32">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
