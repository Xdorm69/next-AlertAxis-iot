"use client";

import { AccessLog, Device, RFID } from "@prisma/client";
import { useState } from "react";
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

const RfidCellData = [
  "Tag Id",
  "Status",
  "Created At",
  "Last Used At",
  "Access Attempts",
  "Last Access Device",
  "Actions",
];

export const RfidInfoTable = ({
  isLoading,
  isFetching,
  data,
  isError,
}: RfidInfoTableProps) => {
  const [page, setPage] = useState<number>(1);

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
              {data &&
                data.map((rfid: RfidInfoTableDataProps) => (
                  <TableRow key={rfid.id}>
                    {/* TAG ID  */}
                    <TableCell>{rfid.tagId}</TableCell>

                    {/* STATUS  */}
                    <TableCell>
                      {rfid.active ? (
                        <Button className="border-emerald-300 border-1 text-white hover:bg-emerald-700/60 bg-emerald-700/40">
                          Active
                        </Button>
                      ) : (
                        <Button variant={"outline"} className="text-white">
                          Inactive
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

                    <TableCell>
                      <Button
                        className="text-white"
                        size="sm"
                        variant="default"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <PaginationBtns
              dataLength={data?.length || 0}
              isFetching={isFetching}
              isLoading={isLoading}
              setPage={setPage}
              page={page}
              divisor={6}
            />
          </div>
        </div>
      </div>
    </>
  );
};
