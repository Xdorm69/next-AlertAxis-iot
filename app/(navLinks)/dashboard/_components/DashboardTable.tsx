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
import { DownloadCSV } from "../fetch/DownloadCSV";
import { DateRange } from "react-day-picker";
import { SkeletonRow } from "./SkeletonRow";
import { HoverCardForText } from "./HoverCardForText";
import DashboardFilters from "./DashboardFilters";
import PaginationBtns from "./PaginationBtns";

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
  const [search, setSearch] = useState<string>("");

  const {
    data: res,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  } = useQuery({
    queryKey: [
      "dashboard",
      "admin",
      statusFilter,
      roleFilter,
      page,
      date?.from?.toISOString(),
      date?.to?.toISOString(),
      search,
    ],
    queryFn: () =>
      fetchDashboardData({
        statusFilter,
        roleFilter,
        page,
        dateFrom: date?.from?.toISOString() || "",
        dateTo: date?.to?.toISOString() || "",
        search,
      }),
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const data = res?.APIData?.data;
  const count = res?.count;

  return (
    <div className="space-y-4">
      {/* FILTERS  */}
      <DashboardFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        date={date}
        setDate={setDate}
        user={user}
        data={data}
        DownloadCSV={DownloadCSV}
      />

      {/* Table */}
      <div className="shadow-xl rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-card">
            <TableRow>
              <TableHead className="font-bold font-mono">User</TableHead>
              <TableHead className="font-bold font-mono">Email</TableHead>
              <TableHead className="font-bold font-mono">Role</TableHead>
              <TableHead className="font-bold font-mono">RFID</TableHead>
              <TableHead className="font-bold font-mono">Device</TableHead>
              <TableHead className="font-bold font-mono">Status</TableHead>
              <TableHead className="font-bold font-mono">Timestamp</TableHead>
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
      <PaginationBtns
        dataLength={count || 0}
        isFetching={isFetching}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        divisor={10}
      />
    </div>
  );
};

export default DashBoardTableWrapper;
