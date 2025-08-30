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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const DashBoardTableWrapper = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardTable />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

const DashboardTable = () => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const { data, isLoading, isError, isSuccess, isFetching, isFetched } =
    useQuery({
      queryKey: ["dashboard", "admin", statusFilter, roleFilter],
      queryFn: () => fetchDashboardData({ statusFilter, roleFilter }),
      initialData: [],
    });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Select onValueChange={setStatusFilter} value={statusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="GRANTED">Granted</SelectItem>
              <SelectItem value="DENIED">Denied</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setRoleFilter} value={roleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>
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
              <TableHead>Status</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ||
              (isFetching &&
                Array.from({ length: 5 }).map((_, idx) => (
                  <SkeletonRow key={idx} />
                )))}
            {isError && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Error...
                </TableCell>
              </TableRow>
            )}
            {isSuccess && !isFetching && !data?.length ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No logs found.
                </TableCell>
              </TableRow>
            ) : (
              !isLoading &&
              !isFetching &&
              data?.map((log: AccessLogWithUser) => (
                <TableRow key={log.id}>
                  <TableCell>{log.user.name || "N/A"}</TableCell>
                  <TableCell className="text-muted-foreground">{log.user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.user.role === "ADMIN" ? "destructive" : "secondary"
                      }
                    >
                      {log.user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{log.rfid.tagId}</TableCell>
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
    </div>
  );
};

const SkeletonRow = () => (
  <TableRow>
    {Array.from({ length: 6 }).map((_, idx) => (
      <TableCell key={idx}>
        <div className="h-4 bg-gray-700 rounded animate-pulse w-full" />
      </TableCell>
    ))}
  </TableRow>
);

export default DashBoardTableWrapper;
