"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { apiFetch } from "@/lib/api";
import { FetchTable } from "@/components/Table/FetchTable";
import { User } from "@prisma/client";
import { RenderDate } from "@/lib/date";
import { HoverCardForText } from "@/app/(navLinks)/dashboard/_components/HoverCardForText";
import { ApiResponse } from "@/Types/api";

const queryClient = new QueryClient();
const page = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container px-4 xl:max-w-7xl mx-auto my-20">
        <FetchTable
          queryKey={["users"]}
          queryFn={() => apiFetch<ApiResponse<User>>("/api/test/users")}
          columns={[
            {
              header: "Id",
              render: (row) => <HoverCardForText data={row.id} tag="Id" />,
            },
            {
              header: "ClerkId",
              render: (row) => <HoverCardForText data={row.clerkId} tag="Id" />,
            },
            {
              header: "Email",
              render: (row) => <HoverCardForText data={row.email} tag="Id" />,
            },
            { header: "Username", render: (row) => row.username },
            { header: "Phone", render: (row) => row.phone },
            { header: "Role", render: (row) => row.role },
            {
              header: "AdminSince",
              render: (row) => (
                <RenderDate date={new Date(row.adminSince || "")} />
              ),
            },
            {
              header: "CreatedAt",
              render: (row) => (
                <RenderDate date={new Date(row.createdAt || "")} />
              ),
            },
            {
              header: "UpdatedAt",
              render: (row) => (
                <RenderDate date={new Date(row.updatedAt || "")} />
              ),
            },
          ]}
        />
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default page;
