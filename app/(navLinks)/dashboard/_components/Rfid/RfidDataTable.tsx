"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { SkeletonRow } from "../SkeletonRow";
import { Badge } from "@/components/ui/badge";
import PaginationBtns from "../PaginationBtns";
import { useState } from "react";
import { SwitchCamera, ToggleRightIcon, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleStatusButton } from "../../(admin)/rfid/[userId]/_components/RfidInfoTable";
import { AddRfidDialog } from "../../(admin)/rfid/_components/AddRfidDialog";
import AddRfidFetchWrapper from "../../(admin)/rfid/_components/Fetch/AddRfidFetchWrapper";
import { RFID } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HoverCardForText } from "../HoverCardForText";

export type RfidLogWithDevice = {
  id: string;
  tagId: string;
  active: boolean;
  user: { id: string; name: string; username?: string | null; email: string };
  createdAt: string;

  _count: {
    accessLogs: number;
  };
};

const rfidCellData = [
  "RFID Id",
  "RFID TagId",
  "User",
  "Status",
  "Logs",
  "Created At",
  "Toggle",
  "Delete",
];

export const FormatDate = (date: Date) => {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const RfidDataTable = ({
  data,
  totalDataLength,
  isLoading,
  isFetching,
  isSuccess,
  isError,
  router,
}: {
  data: RfidLogWithDevice[] | undefined;
  totalDataLength: number;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  router: any;
}) => {
  const [page, setPage] = useState(1);
  return (
    <div className="overflow-auto">
      <Table className="border rounded-lg">
        <TableHeader>
          <TableRow className="bg-card sticky top-0 z-10">
            {rfidCellData.map((cell, idx) => (
              <TableCell key={idx} className="font-semibold">
                {cell}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Loading / Fetching */}
          {(isLoading || isFetching) &&
            Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonRow key={idx} length={rfidCellData.length} />
            ))}

          {/* Error */}
          {isError && (
            <TableRow>
              <TableCell
                colSpan={rfidCellData.length}
                className="text-center py-4 text-red-500"
              >
                Error loading RFID logs
              </TableCell>
            </TableRow>
          )}

          {/* Success & Data */}
          {!isFetching &&
            isSuccess &&
            data &&
            data?.map((rfid) => (
              <TableRow key={rfid.id}>
                <TableCell>
                  <HoverCardForText data={rfid.id} tag="RFID id" />
                </TableCell>
                <TableCell>
                  <HoverCardForText data={rfid.tagId} tag="RFID tagId" />
                </TableCell>
                <TableCell>
                  <HoverCardForText
                    data={[
                      {
                        id: rfid.user.id,
                        name: rfid.user.name,
                        email: rfid.user.email,
                        username: rfid.user.username,
                      },
                    ]}
                    tag="User"
                    displayKey={rfid.user.id}
                  />
                </TableCell>
                <TableCell>
                  <Badge
                    className="text-white"
                    variant={rfid.active ? "default" : "destructive"}
                  >
                    {rfid.active ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </TableCell>
                <TableCell>{rfid._count.accessLogs || 0}</TableCell>
                <TableCell>
                  <HoverCardForText
                    data={[{ date: new Date(rfid.createdAt).toLocaleString() }]}
                    tag="Created At"
                    displayKey={FormatDate(new Date(rfid.createdAt))}
                  />
                </TableCell>
                <TableCell>
                  <ToggleStatusButton
                    icon={<SwitchCamera />}
                    userId={rfid.user.id}
                    rfidId={rfid.id}
                    status={rfid.active}
                  />
                </TableCell>
                <TableCell>
                  <DeleteRfidAlertDialog rfidId={rfid.id} />
                </TableCell>
              </TableRow>
            ))}

          {/* Empty State */}
          {isSuccess && data && data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={rfidCellData.length}
                className="text-center py-4 text-muted-foreground"
              >
                No RFID activity logs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <AddRfidDialog />
        <PaginationBtns
          dataLength={totalDataLength}
          page={page}
          setPage={setPage}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
};

export default RfidDataTable;

const DeleteRfidAlertDialog = ({ rfidId }: { rfidId: string }) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-rfid", rfidId],
    mutationFn: async () => {
      const res = await fetch(`/api/rfid/delete-rfid/${rfidId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw data;
      return data;
    },
    onMutate: () => {
      toast.loading("Deleting rfid...", { id: "delete-rfid" });
    },
    onSuccess: () => {
      toast.success("Rfid deleted successfully", { id: "delete-rfid" });
      queryClient.invalidateQueries({ queryKey: ["rfid-data-all"] });
    },
    onError: (data: { error: string }) => {
      toast.error(data.error || "Error deleting rfid", { id: "delete-rfid" });
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this RFID log? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              mutate();
            }}
            disabled={isPending}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
