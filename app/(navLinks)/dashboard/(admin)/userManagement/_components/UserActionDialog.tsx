"use client";

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
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { HoverCardForText } from "../../../_components/HoverCardForText";
import RoleChangeDialog from "./RoleChangeDialog";




export const UserActionsDialog = ({
  clerkId,
  currentClerkUserId,
}: {
  clerkId: string;
  currentClerkUserId: string;
}) => {
  const { data, isFetching, isError } = useQuery({
    queryKey: [clerkId, "user-data"],
    queryFn: () => fetch(`/api/users/${clerkId}`).then((res) => res.json()),
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });

  const queryClient = useQueryClient();

  const handleRoleChange = async ({
    role,
    secret,
  }: {
    role: "USER" | "ADMIN";
    secret?: string;
  }) => {
    toast.loading("Applying change", { id: "role-change" });

    const res = await fetch(`/api/users/${clerkId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role, secret }),
    });

    const result = await res.json();
    if (res.ok) {
      toast.success(result.message || "Change applied", {
        id: "role-change",
      });
      await queryClient.refetchQueries({ queryKey: ["users-data"] });
      await queryClient.refetchQueries({ queryKey: [clerkId, "user-data"] });
    } else {
      toast.error(result.error || "Failed to apply change", {
        id: "role-change",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary font-bold text-2xl">
            User Actions
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-mono">
            Update role, status, or Delete User.
          </DialogDescription>
        </DialogHeader>

        {/* Form body */}
        <form className="space-y-4 my-4">
          {/* Status + Role */}

          {isFetching ? (
            <>
              <div className="animate-pulse bg-card h-10 rounded-md w-full" />
              <div className="animate-pulse bg-card h-10 rounded-md w-full" />
            </>
          ) : isError ? (
            <div className="text-red-500 col-span-2">
              Error while fetching user data
            </div>
          ) : (
            data && (
              <>
                {data.isUserActive.lastLoggedInAt && (
                  <>
                    <h1 className="text-primary font-bold text-2xl">
                      User Activity
                    </h1>
                    <div className="w-full bg-card p-4 rounded-md">
                      <div className="flex w-full justify-between items-center">
                        <p className="text-sm text-muted-foreground">Role</p>
                        <span>{data?.activeUserRole?.role}</span>
                      </div>
                      <div className="flex w-full justify-between items-center">
                        <p className="text-sm text-muted-foreground">Status</p>
                        <span>
                          {data?.isUserActive.loggedIn
                            ? "LoggedIn"
                            : "LoggedOut"}
                        </span>
                      </div>
                      <div className="flex w-full justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          isMobile
                        </p>
                        <span>
                          {data.isUserActive.lastLoggedInAt.isMobile
                            ? "Yes"
                            : "No"}
                        </span>
                      </div>
                      <div className="flex w-full justify-between items-center">
                        <p className="text-sm text-muted-foreground">City</p>
                        <span>{data.isUserActive.lastLoggedInAt.city}</span>
                      </div>
                      <div className="flex w-full justify-between items-center">
                        <p className="text-sm text-muted-foreground">Country</p>
                        <span>{data.isUserActive.lastLoggedInAt.country}</span>
                      </div>
                      <div className="flex w-full justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Browser Name
                        </p>
                        <span>
                          {data.isUserActive.lastLoggedInAt.browserName}
                        </span>
                      </div>
                      <div className="flex w-full justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Browser Version
                        </p>
                        <span>
                          {data.isUserActive.lastLoggedInAt.browserVersion}
                        </span>
                      </div>
                      <div className="flex w-full justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Device Type
                        </p>
                        <span>
                          {data.isUserActive.lastLoggedInAt.deviceType}
                        </span>
                      </div>
                      <div className="flex w-full justify-between items-center">
                        <p className="text-sm text-muted-foreground">IP</p>
                        <span>
                          <HoverCardForText
                            data={data.isUserActive.lastLoggedInAt.ipAddress}
                            tag="ipAddress"
                          />
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* RESTRICTING CURRENT ADMIN TO ACCIDENTALy CHANGE HIS OWN STATUS OR DELETE HIMSELF. */}
                {clerkId !== currentClerkUserId ? (
                  <div className="grid grid-cols-2 gap-4 w-full mt-8">
                    {/* Force Logout */}
                    <div className="space-y-2">
                      <Label className="font-semibold">Force Logout</Label>
                      <Button
                        variant="secondary"
                        className="w-full"
                        type="button"
                        onClick={() =>
                          toast.error("Feature not shipped yet contact admin")
                        }
                        disabled={!data.isUserActive.loggedIn}
                      >
                        Force Logout
                      </Button>
                    </div>

                    {/* Delete User */}
                    <div className="space-y-2">
                      <Label className="font-semibold">Delete User</Label>
                      <Button
                        variant="destructive"
                        className="w-full"
                        type="button"
                        disabled={clerkId === currentClerkUserId}
                      >
                        Delete User
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="font-mono text-red-500">
                    You&apos;re currently logged In cannot change your status
                    now.
                  </div>
                )}
              </>
            )
          )}

          {/* Footer */}
          <DialogFooter className="mt-8 gap-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>

            <RoleChangeDialog
              currentRole={data?.activeUserRole.role}
              onConfirm={handleRoleChange}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
