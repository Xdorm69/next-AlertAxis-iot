"use client";

import { useQuery } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonRow } from "@/app/(navLinks)/dashboard/_components/SkeletonRow";
import { HoverCardForText } from "@/app/(navLinks)/dashboard/_components/HoverCardForText";
import { Badge } from "@/components/ui/badge";
import { fetchUserWithRfid } from "../_fetch/fetchUserWithRfid";

const UserDataTableRowCells = [
  "Id",
  "Username",
  "Role",
  "Email",
  "Created At",
  "Updated At",
];

export const UserInfoTable = ({userId}: {userId: string}) => {
  const {data, isFetching, isLoading, isError, isSuccess} = useQuery({
    queryKey: ["user-data-with-rfid", userId],
    queryFn: () => fetchUserWithRfid(userId),
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });

  return (
    <>
      <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold text-primary">
        User Info
      </h1>
      <p className="text-muted-foreground font-mono mt-2 text-sm w-3/4 md:text-md">
        User information about the user with the provided ID.
      </p>
      <div>
        <Table className="border rounded-lg mt-8">
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
                {Array.from({ length: 1 }).map((_, idx) => (
                  <SkeletonRow
                    key={idx}
                    length={UserDataTableRowCells.length}
                  />
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
            {isSuccess && !data ? (
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
              !isFetching && (
                <TableRow key={data.id}>
                  <TableCell>
                    {data.id}
                  </TableCell>
                  <TableCell>{data.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        data.role === "ADMIN" ? "destructive" : "secondary"
                      }
                    >
                      {data.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {data.email}
                  </TableCell>
                  <TableCell>
                    {data.createdAt &&
                      new Date(data.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {data.updatedAt &&
                      new Date(data.updatedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
