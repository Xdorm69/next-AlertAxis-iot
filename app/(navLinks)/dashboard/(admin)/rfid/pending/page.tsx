"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { HoverCardForText } from "../../../_components/HoverCardForText";
import { RequestTypes } from "@prisma/client";
import { Check, CheckCheckIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SkeletonRow } from "../../../_components/SkeletonRow";
import { defaultQueryOptions } from "@/lib/helpers/queryOptions";


type PendingDataRequest = {
  id: string;
  userId: string;
  rfidId?: string;
  targetRfidId?: string;
  tempTagId?: string;
  approvedByAdmin?: string;
  requestType: RequestTypes;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
  };
  rfid: {
    id: string;
    tagId: string;
  };
};

type PendingRequestType = {
  success: boolean;
  error?: string;
  message?: string;
  data: PendingDataRequest[];
};

const pendingCellData = [
  "id",
  "userId",
  "requestType",
  "rfidId",
  "targetRfidId",
  "tempTagId",
  "approvedByAdmin",
  "createdAt",
  "Actions",
];

const fetchPendingRequests = async (search: string): Promise<PendingRequestType> => {
  const res = await fetch(`/api/users/pending-requests?search=${search}`);
  if (!res.ok) throw new Error("Failed to fetch pending requests");
  return res.json();
};

const PendingRequestsPage = () => {
  const [search, setSearch] = useState("");

  const {
    data: res,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useQuery<PendingRequestType>({
    queryKey: ["pending-requests", search],
    queryFn: () => fetchPendingRequests(search),
    ...defaultQueryOptions
  });

  const data = res?.data || [];

  const handleBadgeVariant = (type: string) => {
    if (type === "DEACTIVATE") return "destructive";
    else if (type === "PORT") return "secondary";
    return "default";
  };

  const handleBadgeColors = (type: string) => {
    switch (type) {
      case "CREATE": // Success vibe
        return "bg-green-500 hover:bg-green-600 text-white";
      case "ACTIVATE": // Primary action vibe
        return "bg-indigo-500 hover:bg-indigo-600 text-white";
      case "DEACTIVATE": // Danger vibe
        return "bg-red-500 hover:bg-red-600 text-white";
      case "PORT": // Info / Neutral vibe
        return "bg-sky-500 hover:bg-sky-600 text-white";
      default: // Fallback
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  const queryClient = useQueryClient();

  const handleApproveMutation = useMutation({
    mutationKey: ["approve-user-req"],
    mutationFn: async (requestId: string) => {
      const res = await fetch(`/api/users/pending-requests/${requestId}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!data.success)
        throw new Error(data.error || "Failed to approve request");
      return data;
    },
    onMutate: () => {
      toast.loading("Approving request...", { id: "approve-user-req" });
    },
    onSuccess: () => {
      toast.success("Request approved successfully", {
        id: "approve-user-req",
      });
      refetch();
      queryClient.refetchQueries({
        queryKey: ["rfid-data-all"],
      });
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to approve request", {
        id: "approve-user-req",
      });
    },
  });

  return (
    <section className="my-20">
      <div className="container mx-auto px-4 xl:w-7xl h-full">
        <div>
          <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold text-primary">Pending RFID Requests</h1>
          <p className="text-muted-foreground font-mono mt-2 mb-8 text-sm w-full lg:w-1/2 md:text-md">
            Can view and approve pending RFID requests. Can search by request id or user id. The requests on page are latest 10 requests only.
          </p>

          <Input
            placeholder="Search request..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 max-w-sm"
          />

         
            <div className="overflow-auto border rounded-lg">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-card">
                    {pendingCellData.map((i, id) => (
                      <TableHead
                        key={id}
                        colSpan={id === pendingCellData.length - 1 ? 2 : 1}
                      >
                        {i}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(isLoading || isFetching) && (
                    Array.from({length: 10}).map((_, id) => (
                      <SkeletonRow key={id} length={pendingCellData.length} />
                    ))
                  )}
                  {isError && (
                    <TableRow>
                      <TableCell colSpan={pendingCellData.length}>
                        Error while fetching requests
                      </TableCell>
                    </TableRow>
                  )}
                  {data && data.length > 0 ? (
                    data.map((req) => (
                      <TableRow key={req.id} className="hover:bg-card">
                        <TableCell>
                          <HoverCardForText data={req.id} tag="Request ID" />
                        </TableCell>
                        <TableCell>
                          <HoverCardForText
                            data={[
                              {
                                username: req.user.username,
                                name: req.user.name,
                                email: req.user.email,
                              },
                            ]}
                            tag="User Info"
                            displayKey={req.userId} // shown in button
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "text-white",
                              handleBadgeColors(req.requestType)
                            )}
                          >
                            {req.requestType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {req.rfidId ? (
                            <HoverCardForText data={req.rfidId} tag="RFID Id" />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {req.targetRfidId ? (
                            <HoverCardForText
                              data={req.targetRfidId}
                              tag="Target RFID Id"
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {req.tempTagId ? (
                            <HoverCardForText
                              data={req.tempTagId}
                              tag="Temp Tag Id"
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {req.approvedByAdmin ? (
                            <HoverCardForText
                              data={req.approvedByAdmin}
                              tag="Approved By Admin"
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(req.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="flex items-center justify-center">
                          {req.approvedByAdmin ? (
                            <div className="rounded-full p-1 bg-emerald-700 text-emerald-50">
                              <CheckCheckIcon />
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className={cn("text-white", handleBadgeColors("CREATE"))}
                                onClick={() =>
                                  handleApproveMutation.mutate(req.id)
                                }
                              >
                                <Check/>
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  toast.error(`Rejected request ${req.id}`)
                                }
                              >
                                <X/>
                              </Button>
                            </div>
                          )}
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
          
        </div>
      </div>
    </section>
  );
};

export default PendingRequestsPage;
