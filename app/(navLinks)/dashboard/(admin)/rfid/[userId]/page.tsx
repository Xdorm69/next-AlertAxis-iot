"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchRfidWithUserId } from "./_fetch/fetchRfidWithUserId";
import { UserInfoTable } from "./_components/UserInfoTable";
import { RfidInfoTable } from "./_components/RfidInfoTable";
import { ActivityLogsTable } from "./_components/ActivityLogsTable";
import { AccessResultsTrendGraph } from "./_components/AccessResultTrendGraph";
import React from "react";

const page = ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = React.use(params);

  const { data, isFetching, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["rfid", userId],
    queryFn: () => fetchRfidWithUserId(userId),
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });

  return (
    <section className="my-20">
      <div className="container mx-auto py-4 px-4 xl:w-7xl h-full">
        <div>
          <UserInfoTable
            isError={isError}
            isFetching={isFetching}
            isLoading={isLoading}
            isSuccess={isSuccess}
            data={data?.userData}
          />
        </div>

        <div>
          <RfidInfoTable
            isError={isError}
            isFetching={isFetching}
            isLoading={isLoading}
            isSuccess={isSuccess}
            data={data?.rfidData}
          />
        </div>

        <div>
          <ActivityLogsTable
            isError={isError}
            isFetching={isFetching}
            isLoading={isLoading}
            isSuccess={isSuccess}
            data={data?.rfidData}
          />
        </div>

        <div>
          <AccessResultsTrendGraph
            isError={isError}
            isFetching={isFetching}
            isLoading={isLoading}
            isSuccess={isSuccess}
            data={data?.charts}
          />
        </div>
      </div>
    </section>
  );
};

export default page;
