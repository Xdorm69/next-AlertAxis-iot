"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonRow } from "../SkeletonRow";
import { Badge } from "@/components/ui/badge";
import PaginationBtns from "../PaginationBtns";
import { useState } from "react";
import { SwitchCamera, ToggleRightIcon, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleStatusButton } from "../../(admin)/rfid/[userId]/_components/RfidInfoTable";

export type RfidLogWithDevice = {
  id: string;
  tagId: string;
  active: boolean;
  user: { id: string; name: string; username?: string | null };
  createdAt: string;

  _count: {
    accessLogs: number;
  };
};

const rfidCellData = [
  "RFID Tag",
  "User",
  "Serial",
  "Status",
  "Created At",
  "Toggle",
  "Delete",
];

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
                <TableCell>{rfid.tagId}</TableCell>
                <TableCell>{rfid.user.id}</TableCell>
                <TableCell>
                  <Badge
                    className="text-white"
                    variant={rfid.active ? "default" : "destructive"}
                  >
                    {rfid.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{rfid._count.accessLogs || 0}</TableCell>
                <TableCell>
                  {new Date(rfid.createdAt).toLocaleString()}
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
                  <Button variant="destructive">
                    <Trash />
                  </Button>
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
      <div className="mt-4">
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
