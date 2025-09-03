import { User } from "@prisma/client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonRow } from "@/app/(navLinks)/dashboard/_components/SkeletonRow";
import { HoverCardForText } from "@/app/(navLinks)/dashboard/_components/HoverCardForText";
import { Button } from "@/components/ui/button";

export type UserInfoTableProps = {
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  data: User;
  isError: boolean;
};

const TableCellData = [
  "Id",
  "Username",
  "Email",
  "Created At",
  "Updated At",
  "Actions",
];

export const UserInfoTable = ({
  isLoading,
  isFetching,
  isSuccess,
  data,
  isError,
}: UserInfoTableProps) => {
  return (
    <>
      <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold text-primary">
        User Info
      </h1>
      <p className="text-muted-foreground font-mono mt-2 text-sm w-3/4 md:text-md">
        User information about the user with the provided ID.
      </p>
      <Table className="border rounded-lg my-8">
        <TableHeader>
          <TableRow className="bg-muted/50 text-sm font-semibold">
            {TableCellData.map((data, idx) => (
              <TableCell key={idx}>{data}</TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {(isLoading || isFetching) && (
            <>
              {Array.from({ length: 1 }).map((_, idx) => (
                <SkeletonRow key={idx} length={TableCellData.length} />
              ))}
            </>
          )}
          {isError && (
            <TableRow>
              <TableCell
                colSpan={TableCellData.length}
                className="text-center py-4 text-red-500"
              >
                Error fetching users
              </TableCell>
            </TableRow>
          )}
          {isSuccess && !data ? (
            <TableRow>
              <TableCell
                colSpan={TableCellData.length}
                className="h-24 text-center"
              >
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            isSuccess &&
            data && (
              <TableRow key={data.id} className="bg-muted/20">
                <TableCell>
                  <HoverCardForText data={data.id} tag="id" />
                </TableCell>
                <TableCell>{data.username}</TableCell>
                <TableCell>
                  <HoverCardForText data={data.email} tag="email" />
                </TableCell>
                <TableCell>
                  {data.createdAt &&
                    new Date(data.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {data.updatedAt &&
                    new Date(data.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button className="text-white">Edit</Button>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </>
  );
};
