"use client";
import React from "react";
import GlobalTableFetchWrapper from "./_components/GlobalTableFetchWrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const page = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container px-4 xl:max-w-7xl mx-auto">
        <GlobalTableFetchWrapper
          queryFn={() => fetch("/api/rfid").then((res) => res.json())}
          queryKey={["rfid"]}
        />
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default page;
