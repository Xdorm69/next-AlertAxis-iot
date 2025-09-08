import { SkeletonRow } from "@/app/(navLinks)/dashboard/_components/SkeletonRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyCell from "./EmptyCell";

export type Column<T> = {
  header: string;
  render: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  isLoading: boolean;
  isError: boolean;
};

export function DataTable<T>({
  data,
  columns,
  isLoading,
  isError,
}: DataTableProps<T>) {
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          {columns.map((col, i) => (
            <TableHead className="bg-card" key={i}>
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading &&
          Array.from({ length: 10 }).map((_, id) => {
            return <SkeletonRow length={columns.length} key={id} />;
          })}
        {isError && (
          <TableRow>
            <TableCell colSpan={columns.length} className="py-10 text-red-600 text-center">
              Error while fetching data
            </TableCell>
          </TableRow>
        )}
        {!isError &&
          !isLoading &&
          data.map((row, i) => (
            <TableRow key={i}>
              {columns.map((col, j) => (
                <TableCell key={j}>
                  {col.render(row) ?? <EmptyCell />}
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
