"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type PendingDataRequest = {
  id: string;
  username: string;
  userId: string;
  rfidId: string;
  requestType: "ACTIVATE" | "DISABLE" | "PORT";
};

type PendingRequest = {
    success: boolean;
    message: string;
    data: PendingDataRequest[];
}


const fetchPendingRequests = async (): Promise<PendingRequest> => {
  const res = await fetch("/api/test/pending");
  if (!res.ok) throw new Error("Failed to fetch pending requests");
  return res.json();
};

const PendingRequestsPage = () => {
  const [search, setSearch] = useState("");

  const { data: res, isLoading, isError, error } = useQuery<PendingRequest>({
    queryKey: ["pending-requests"],
    queryFn: fetchPendingRequests,
  });

  const data = res?.data;

  return (
    <section className="my-20">
      <div className="container mx-auto px-4 xl:w-7xl h-full">
        <div>
          <h1 className="text-2xl font-bold mb-4">Pending RFID Requests</h1>

          <Input
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 max-w-sm"
          />

          {isLoading ? (
            <div>Loading requests...</div>
          ) : isError ? (
            <div className="text-red-500">
              Error: {(error as Error).message}
            </div>
          ) : (
            <div className="overflow-auto border rounded-lg">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-card">
                    <TableHead>Request ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Rfid Id</TableHead>
                    <TableHead>Request Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data && data.length > 0 ? (
                    data.map((req) => (
                      <TableRow key={req.id} className="hover:bg-card">
                        <TableCell>{req.id}</TableCell>
                        <TableCell>{req.username}</TableCell>
                        <TableCell>{req.userId}</TableCell>
                        <TableCell>{req.rfidId}</TableCell>
                        <TableCell>
                            <Badge className="text-white" variant={req.requestType === "ACTIVATE" ? "default" : "destructive"}>
                                {req.requestType}
                            </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="text-white"
                              onClick={() =>
                                toast.success(`Approved request ${req.id}`)
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                toast.error(`Rejected request ${req.id}`)
                              }
                            >
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-4 text-muted-foreground"
                      >
                        No pending requests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PendingRequestsPage;
