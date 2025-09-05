"use client";

import React from "react";
import RfidDataTable from "../RfidDataTable";
import { useQuery } from "@tanstack/react-query";
import { fetchAllRfidData } from "./fetchAllRfidData";
import { useRouter } from "next/navigation";

export const defaultQueryOptions = {
  gcTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
  staleTime: 10 * 60 * 1000,
};

const RfidDataTableFetchWrapper = () => {
  const { data, isLoading, isFetching, isSuccess, isError } = useQuery({
    queryKey: ["rfid-data-all"],
    queryFn: () => fetchAllRfidData(),
    ...defaultQueryOptions,
  });
  const router = useRouter();
  return (
    <div>
      <RfidDataTable
        router={router}
        data={data?.data}
        isLoading={isLoading}
        totalDataLength={data?.totalDataLength || 0}
        isFetching={isFetching}
        isSuccess={isSuccess}
        isError={isError}
      />
    </div>
  );
};

export default RfidDataTableFetchWrapper;
