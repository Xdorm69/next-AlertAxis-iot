"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { fetchDashboardData } from "../fetch/fetchData";
import { AccessLogWithUser } from "@/app/api/dashboard/route";
import { Button } from "@/components/ui/button";
import { DownloadCSV } from "../fetch/DownloadCSV";
import { DateRange } from "react-day-picker";
import { SkeletonRow } from "./SkeletonRow";
import { HoverCardForText } from "./HoverCardForText";
import { DateRangePicker } from "./DateRangePicker";
import SelectRoleDashboard from "./SelectRoleDashboard";
import SelectStatusDashboard from "./SelectStatusDashboard";

const DashBoardTableWrapper = ({
  user,
}: {
  user: { role: string; name: string };
}) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardTable user={user} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

const DashboardTable = ({ user }: { user: { role: string; name: string } }) => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [page, setPage] = useState<number>(1);
  const [date, setDate] = useState<DateRange | undefined>();

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery({
    queryKey: [
      "dashboard",
      "admin",
      statusFilter,
      roleFilter,
      page,
      date?.from?.toISOString(),
      date?.to?.toISOString(),
    ],
    queryFn: () =>
      fetchDashboardData({
        statusFilter,
        roleFilter,
        page,
        dateFrom: date?.from?.toISOString() || "",
        dateTo: date?.to?.toISOString() || "",
      }),
    refetchOnWindowFocus: false,
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <SelectStatusDashboard
            setStatusFilter={setStatusFilter}
            statusFilter={statusFilter}
          />

          {user.role === "ADMIN" && (
            <SelectRoleDashboard
              setRoleFilter={setRoleFilter}
              roleFilter={roleFilter}
            />
          )}

          <DateRangePicker date={date} setDate={setDate} />
        </div>

        <Button
          className="text-white cursor-pointer font-semibold"
          onClick={() => DownloadCSV(data || [])}
        >
          Download CSV
        </Button>
      </div>

      {/* Table */}
      <div className="shadow-xl rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-card">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>RFID</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(isLoading || isFetching) &&
              Array.from({ length: 10 }).map((_, idx) => (
                <SkeletonRow key={idx} />
              ))}
            {isError && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Error...
                </TableCell>
              </TableRow>
            )}
            {isSuccess && !isFetching && !data?.length ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No logs found.
                </TableCell>
              </TableRow>
            ) : (
              !isLoading &&
              !isFetching &&
              data?.map((log: AccessLogWithUser) => (
                <TableRow key={log.id}>
                  <TableCell>{log.user.name || "N/A"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <HoverCardForText data={log.user.email} tag={"email"} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.user.role === "ADMIN" ? "destructive" : "secondary"
                      }
                    >
                      {log.user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <HoverCardForText data={log.rfid.tagId} tag={"rfid tag"} />
                  </TableCell>
                  <TableCell>{log.device.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.status === "GRANTED" ? "default" : "destructive"
                      }
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="pagination btns flex gap-4 justify-end items-center w-full">
        <Button
          variant={"outline"}
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant={"outline"}
          disabled={data && data.length < 10}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DashBoardTableWrapper;
