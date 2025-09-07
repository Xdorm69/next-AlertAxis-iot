"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { UsersDataSchema } from "@/app/api/users/route";
import { HoverCardForText } from "../../../_components/HoverCardForText";
import { SkeletonRow } from "../../../_components/SkeletonRow";
import { Button } from "@/components/ui/button";
import PaginationBtns from "../../../_components/PaginationBtns";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { UserActionsDialog } from "./UserActionDialog";
import { UserManagementDataFetch } from "../_fetch/UserManagementDataFetch";
import { DateRange } from "react-day-picker";
import DashboardFilters from "../../../_components/DashboardFilters";
import { DownloadCSV } from "../../../_fetch/DownloadCSV";

const UserDataTableRowCells = [
  "Id",
  "Username",
  "Role",
  "Email",
  "RFID",
  "Created At",
  "Updated At",
  "Actions",
];

export const UserDataTable = () => {
  const {
    data: res,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["users-data"],
    queryFn: () => UserManagementDataFetch(search, roleFilter, date, page),
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });

  //Filtering States
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [date, setDate] = useState<DateRange | undefined>();
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, date]);

  useEffect(() => {
    refetch();
  }, [search, roleFilter, date, page]);

  
  const data: UsersDataSchema[] | null = res?.users;

  return (
    <div>
      <div className="mb-4">
        <DashboardFilters
          search={search}
          setSearch={setSearch}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          date={date}
          setDate={setDate}
          user={{ role: "ADMIN" }}
          data={data}
          DownloadCSV={DownloadCSV}
        />
      </div>
      <Table className="border rounded-lg">
        <TableHeader>
          <TableRow className="bg-muted/50 text-sm font-semibold">
            {UserDataTableRowCells.map((cell, i) => (
              <TableCell key={i}>{cell}</TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {(isLoading || isFetching) && (
            <>
              {Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonRow key={idx} length={UserDataTableRowCells.length} />
              ))}
            </>
          )}
          {isError && (
            <TableRow>
              <TableCell
                colSpan={UserDataTableRowCells.length}
                className="text-center py-4 text-red-500"
              >
                Error fetching users
              </TableCell>
            </TableRow>
          )}
          {isSuccess && !data?.length ? (
            <TableRow>
              <TableCell
                colSpan={UserDataTableRowCells.length}
                className="h-24 text-center"
              >
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            data &&
            !isFetching &&
            data?.map((user, i) => (
              <TableRow
                key={user.id}
                className={i % 2 === 0 ? "bg-muted/20" : ""}
              >
                <TableCell>
                  <HoverCardForText data={user.id} tag="id" />
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "ADMIN" ? "destructive" : "secondary"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <HoverCardForText data={user.email} tag="email" />
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/rfid/${user.id}`}>
                    <Button variant={"ghost"} className="text-white">
                      {user._count.rfids || 0}
                    </Button>
                  </Link>
                </TableCell>
                <TableCell>
                  {user.createdAt &&
                    new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {user.updatedAt &&
                    new Date(user.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <UserActionsDialog
                    clerkId={user.clerkId}
                    currentClerkUserId={res?.currentClerkUserId}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="pagination mt-8">
        <PaginationBtns
          dataLength={data?.length || 0}
          isFetching={isFetching}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
        />
      </div>
    </div>
  );
};
