import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

export const SkeletonRow = () => (
  <TableRow>
    {Array.from({ length: 7 }).map((_, idx) => (
      <TableCell key={idx}>
        <div className="h-8 bg-gray-700 rounded animate-pulse w-full" />
      </TableCell>
    ))}
  </TableRow>
);