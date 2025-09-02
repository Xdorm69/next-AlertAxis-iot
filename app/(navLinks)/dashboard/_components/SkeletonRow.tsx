import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

export const SkeletonRow = ({length,colspanIdx,colspan}: {length? : number, colspanIdx?: number[], colspan?: number}) => (
  <TableRow>
    {Array.from({ length: length || 7 }).map((_, idx) => (
      <TableCell key={idx} colSpan={colspanIdx?.includes(idx) ? colspan : 1}>
        <div className="h-8 bg-gray-700 rounded animate-pulse w-full" />
      </TableCell>
    ))}
  </TableRow>
);