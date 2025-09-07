"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { HoverCardForText } from "@/app/(navLinks)/dashboard/_components/HoverCardForText";
import { SkeletonRow } from "@/app/(navLinks)/dashboard/_components/SkeletonRow";
import PaginationBtns from "@/app/(navLinks)/dashboard/_components/PaginationBtns";


type GlobalTableProps = {
  isLoading?: boolean;
  isFetching?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  cells: string[];
  data?: Array<Record<string, string | number | boolean | null>>;
  dates?: string[];
  hiddenText?: Record<string, string>;
  className?: string;
  pagination?: boolean;
  dataDivisorForPagination?: number;
};

const capitalizeString = (str: string) => {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
};

const GlobalTable = ({
  isLoading,
  isFetching,
  isSuccess,
  isError,
  cells,
  data,
  dates,
  hiddenText,
  className,
  pagination,
  dataDivisorForPagination,
}: GlobalTableProps) => {
  const [page, setPage] = useState<number>(1);

  return (
    <>
      <div
        className={cn(
          "overflow-auto rounded-md border max-h-[70vh]",
          className
        )}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-card sticky top-0 z-10">
              {cells.map((header) => (
                <TableCell key={header} className="font-semibold">
                  {capitalizeString(header)}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Loading / Pending */}
            {(isLoading || isFetching) &&
              Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonRow key={idx} length={(cells.length as number) || 0} />
              ))}

            {/* Error State */}
            {isError && (
              <TableRow>
                <TableCell
                  colSpan={cells.length || 1}
                  className="text-center py-4 text-red-500"
                >
                  Error loading data
                </TableCell>
              </TableRow>
            )}

            {/* Success + Data */}
            {!isFetching &&
              isSuccess &&
              data &&
              data.map((row, rowIdx) => (
                <TableRow key={rowIdx}>
                  {cells.map((key, id) => {
                    const value = row[key];
                    let displayValue =
                      value === null || value === undefined
                        ? "—"
                        : String(value);
                    if (dates?.includes(key)) {
                      displayValue = new Date(
                        value as string
                      ).toLocaleDateString("en-US", {
                        month: "short", // "Sep"
                        day: "numeric", // 2
                        year: "numeric", // 2025
                      });
                    }

                    return (
                      <TableCell key={`${rowIdx}-${key}`}>
                        {hiddenText?.[key] ? (
                          <HoverCardForText data={displayValue} tag={key} />
                        ) : (
                          displayValue
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}

            {/* Empty State */}
            {isSuccess && data && data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={cells.length || 1}
                  className="text-center py-4 text-muted-foreground"
                >
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        {pagination && (
          <PaginationBtns
            dataLength={data?.length || 0}
            page={page}
            setPage={setPage}
            isFetching={isFetching || false}
            isLoading={isLoading || false}
            divisor={dataDivisorForPagination || 10}
          />
        )}
      </div>
    </>
  );
};

export default GlobalTable;
