"use client";
import React from "react";
import GlobalTable from "./GlobalTable";
import { useQuery } from "@tanstack/react-query";
import { defaultQueryOptions } from "@/lib/helpers/queryOptions";


const GlobalTableFetchWrapper = ({
  queryFn,
  queryKey,
}: {
  queryFn: () => Promise<any>;
  queryKey: string[];
}) => {
  const { data, isLoading, isFetching, isSuccess, isError } = useQuery({
    queryKey,
    queryFn,
    ...defaultQueryOptions,
  });

  function isValidDateString(dateString: string) {
    return !isNaN(Date.parse(dateString));
  }

  const extractCells = (data: any[]) => {
    if (!data) return {cells: [], dates: []};
    const cells = Object.keys(data[0]);
    const dates = cells.filter((key) => isValidDateString(data[0][key]));
    return { cells, dates };
  };

//   const { cells, dates } = extractCells(data);

  return (
    <div className="my-20">
      {/* <GlobalTable
        isLoading={isLoading}
        isFetching={isFetching}
        isSuccess={isSuccess}
        isError={isError}
        cells={cells}
        dates={dates}
        data={data || []}
        hiddenText={{
          email: "Email Address",
          id: "userId",
          clerkId: "Clerk Id",
        }}
        pagination
        dataDivisorForPagination={10}
      /> */}
    </div>
  );
};

export default GlobalTableFetchWrapper;
