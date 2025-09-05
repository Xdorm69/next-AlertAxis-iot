import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationBtnsProps = {
  isLoading: boolean;
  isFetching: boolean;
  page: number;
  setPage: (page: number) => void;
  dataLength: number;
  divisor?: number;
};

const PaginationBtns = ({
  isLoading,
  isFetching,
  page,
  setPage,
  dataLength,
  divisor = 10, // default divisor
}: PaginationBtnsProps) => {
  const totalPages = Math.max(1, Math.ceil(dataLength / divisor));
  const isBusy = isLoading || isFetching;

  return (
    <div className="flex justify-end items-center gap-4 w-full">
      <Button
        variant="outline"
        disabled={page <= 1 || isBusy}
        onClick={() => setPage(page - 1)}
        className="flex items-center gap-1"
      >
        <ChevronLeft /> Previous
      </Button>
      {isBusy ? (
        <div className="h-9 w-20 bg-gray-700 rounded animate-pulse" />
      ) : (
        <div className="text-muted-foreground rounded-lg bg-card shadow px-4 py-2">
          Page: <span className="text-foreground">{page}</span> / {totalPages}
        </div>
      )}

      <Button
        variant="outline"
        disabled={isBusy || page >= totalPages || !dataLength}
        onClick={() => setPage(page + 1)}
        className="flex items-center gap-1"
      >
        Next <ChevronRight />
      </Button>
    </div>
  );
};

export default PaginationBtns;
