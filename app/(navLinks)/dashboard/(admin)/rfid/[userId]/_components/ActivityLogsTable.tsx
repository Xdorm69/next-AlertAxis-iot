import { RfidInfoTableDataProps, RfidInfoTableProps } from "./RfidInfoTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonRow } from "@/app/(navLinks)/dashboard/_components/SkeletonRow";
import { Device } from "@prisma/client";

type RfidActivityLogsTable = RfidInfoTableProps;

const ActivityLogsCellData = [
  "Rfid Tag",
  "Serial Number",
  "Name",
  "Location",
  "Status",
  "InstalledAt",
  "Registered By",
];

export const ActivityLogsTable = ({
  isLoading,
  isFetching,
  data,
  isError,
}: RfidActivityLogsTable) => {
  return (
    <>
      <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold text-primary mt-8">
        Activity Logs
      </h1>
      <p className="text-muted-foreground font-mono mt-2 text-sm w-3/4 md:text-md">
        Logs of last devices accessed by rfid.
      </p>

      {/* RFID DATA  */}

      <div className="mt-4">
        <div className="py-4 overflow-auto rounded-md max-h-[60vh]">
          <Table className="border">
            <TableHeader>
              <TableRow className="bg-card sticky top-0 z-10">
                {ActivityLogsCellData.map((cell, idx) => (
                  <TableCell key={idx} className="font-semibold">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isLoading || isFetching) &&
                Array.from({ length: 3 }).map((_, idx) => (
                  <SkeletonRow key={idx} length={ActivityLogsCellData.length} />
                ))}
              {isError && (
                <TableRow>
                  <TableCell
                    colSpan={ActivityLogsCellData.length}
                    className="text-center py-4 text-red-500"
                  >
                    Error fetching activity logs
                  </TableCell>
                </TableRow>
              )}
              {data &&
                data.map((rfid: RfidInfoTableDataProps) =>
                  rfid.recentDevicesUsed.map((device: Device) => (
                    <TableRow key={`${rfid.id}-${device.id}`}>
                      <TableCell>{rfid.tagId}</TableCell>
                      <TableCell>{device.serialNumber}</TableCell>
                      <TableCell>{device.name || "NA"}</TableCell>
                      <TableCell>{device.location || "NA"}</TableCell>
                      <TableCell>{device.status}</TableCell>
                      <TableCell>
                        {device.installedAt
                          ? new Date(device.installedAt).toLocaleDateString()
                          : "NA"}
                      </TableCell>
                      <TableCell>{device.registeredById || "NA"}</TableCell>
                    </TableRow>
                  ))
                )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};
