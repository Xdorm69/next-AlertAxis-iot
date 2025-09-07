"use client";

import { AccessLog, Device, RFID } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonRow } from "@/app/(navLinks)/dashboard/_components/SkeletonRow";
import { Button } from "@/components/ui/button";
import PaginationBtns from "@/app/(navLinks)/dashboard/_components/PaginationBtns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SwitchCamera } from "lucide-react";
import { defaultQueryOptions } from "@/lib/helpers/queryOptions";
import { apiFetch } from "@/lib/api";

export type RfidInfoTableDataProps = RFID & {
  accessLogs: AccessLog[];
  lastUsedAt: Date;
  accessAttempts: number;
  lastAccessDevice: Device;
  recentDevicesUsed: Device[];
  accessResultBreakdown: { DENIED: number; GRANTED: number };
};

export type RfidInfoTableProps = {
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  data: RfidInfoTableDataProps[];
  isError: boolean;
};

const RfidCellData: string[] = [
  "Tag Id",
  "Status",
  "Created At",
  "Last Used At",
  "Access Attempts",
  "Last Access Device",
  "Actions",
];

export const RfidInfoTable = ({
  userId,
  isUser,
}: {
  userId: string;
  isUser?: boolean;
}) => {
  const {
    data: res,
    isLoading,
    isFetching,
    isError,
  } = useQuery<{rfids: RfidInfoTableDataProps[]}>({
    queryKey: ["rfid-data", userId],
    queryFn: () => apiFetch(`/api/rfid/${userId}`),
    ...defaultQueryOptions,
  });

  const data = res?.rfids;

  const { mutate, isPending } = useMutation({
    mutationKey: ["change-rfid-status-user"],
    mutationFn: async ({ tagId, requestType }: { tagId: string; requestType: string }) => {
      const res = await fetch(`/api/rfid/add-rfid-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          tagId,
          requestType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      return data;
    },
    onMutate: () => {
      toast.loading("Toggling Status...", { id: "toggle" });
    },
    onSuccess: () => {
      toast.success("Status changed successfully", { id: "toggle" });
    },
    onError: (data: { error: string }) => {
      toast.error(data.error || "Failed to change status", { id: "toggle" });
    },
  });

  return (
    <>
      <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold text-primary mt-4">
        RFID
      </h1>
      <p className="text-muted-foreground font-mono mt-2 text-sm w-3/4 md:text-md">
        RFID information about the user with the provided ID.
      </p>

      {/* RFID DATA  */}

      <div className="mt-4">
        <div className="py-4 overflow-auto rounded-md max-h-[60vh]">
          <Table className="border">
            <TableHeader>
              <TableRow className="bg-card sticky top-0 z-10">
                {RfidCellData.map((cell, idx) => (
                  <TableCell key={idx} className="font-semibold">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isLoading || isFetching) &&
                Array.from({ length: 3 }).map((_, idx) => (
                  <SkeletonRow key={idx} length={RfidCellData.length} />
                ))}
              {isError && (
                <TableRow>
                  <TableCell
                    colSpan={RfidCellData.length}
                    className="text-center py-4 text-red-500"
                  >
                    Error fetching rfid data
                  </TableCell>
                </TableRow>
              )}
              {!isFetching && !data && (
                <TableRow>
                  <TableCell
                    colSpan={RfidCellData.length}
                    className="text-center py-4"
                  >
                    No rfid data found
                  </TableCell>
                </TableRow>
              )}
              {!isFetching &&
                data &&
                data.map((rfid: RfidInfoTableDataProps) => (
                  <TableRow key={rfid.id}>
                    {/* TAG ID  */}
                    <TableCell>{rfid.tagId}</TableCell>

                    {/* STATUS  */}
                    <TableCell>
                      {rfid.active ? (
                        <Button className="border-emerald-300 border-1 text-white hover:bg-emerald-700/60 bg-emerald-700/40">
                          ACTIVE
                        </Button>
                      ) : (
                        <Button variant={"outline"} className="text-white">
                          INACTIVE
                        </Button>
                      )}
                    </TableCell>

                    {/* Created At  */}
                    <TableCell>
                      {new Date(rfid.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* LAST USED AT  */}
                    <TableCell>
                      {new Date(rfid.lastUsedAt).toLocaleDateString()}
                    </TableCell>

                    {/* ACCESS ATTEMPTS  */}
                    <TableCell>{rfid.accessAttempts}</TableCell>

                    {/* LAST ACCESS DEVICE  */}
                    <TableCell>
                      {rfid.lastAccessDevice?.name || "N/A"}
                    </TableCell>

                    {!isUser ? (
                      <TableCell>
                        <ToggleStatusButton
                          userId={userId}
                          rfidId={rfid.id}
                          status={rfid.active}
                        />
                      </TableCell>
                    ) : (
                      <TableCell>
                        <Button
                        className="text-white"
                        disabled={isPending}
                          onClick={() =>
                            mutate({
                              tagId: rfid.tagId,
                              requestType: !rfid.active ? "ACTIVATE" : "DEACTIVATE",
                            })
                          }
                        >
                          Request <SwitchCamera />{" "}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export const ToggleStatusButton = ({
  userId,
  rfidId,
  status,
  icon,
}: {
  userId: string;
  rfidId?: string;
  status: boolean;
  icon?: React.ReactNode;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["rfid", rfidId, "toggle-status"],
    mutationFn: async () => {
      const res = await fetch(`/api/rfid/${rfidId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: !status }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      return data;
    },
    onMutate: () => {
      toast.loading("Toggling rfid status", { id: "rfid-status" });
    },
    onError: (data: { error: string }) => {
      toast.error(data.error || "Error while toggling rfid status", {
        id: "rfid-status",
      });
    },
    onSuccess: (data: { message: string }) => {
      queryClient.invalidateQueries({ queryKey: ["rfid-data", userId] });
      queryClient.invalidateQueries({ queryKey: ["rfid-data-all"] });

      toast.success(data.message || "RFID status toggled successfully", {
        id: "rfid-status",
      });
    },
  });

  return (
    <Button
      onClick={() => mutation.mutate()}
      variant={"outline"}
      className="text-foreground"
    >
      {icon ? icon : "Toggle"}
    </Button>
  );
};
