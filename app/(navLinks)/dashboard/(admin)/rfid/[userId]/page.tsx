"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonRow } from "../../../_components/SkeletonRow";
import PaginationBtns from "../../../_components/PaginationBtns";
import { AccessLog, Device, RFID, User } from "@prisma/client";
import { HoverCardForText } from "../../../_components/HoverCardForText";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const page = ({ params }: { params: { userId: string } }) => {
  const userId = params.userId;
  const { data, isFetching, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["rfid", userId],
    queryFn: async () => {
      const res = await fetch(`/api/rfid/${userId}`);
      return res.json();
    },
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });

  return (
    <section className="my-20">
      <div className="container mx-auto py-4 px-4 xl:w-7xl h-full">
        {/* USER INFO  */}

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

type UserInfoTableProps = {
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  data: User;
  isError: boolean;
};

const UserInfoTable = ({
  isLoading,
  isFetching,
  isSuccess,
  data,
  isError,
}: UserInfoTableProps) => {
  return (
    <>
      <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold text-primary">
        User Info
      </h1>
      <p className="text-muted-foreground font-mono mt-2 text-sm w-3/4 md:text-md">
        User information about the user with the provided ID.
      </p>
      <Table className="border rounded-lg my-8">
        <TableHeader>
          <TableRow className="bg-muted/50 text-sm font-semibold">
            <TableCell>Id</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Updated At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(isLoading || isFetching) && (
            <>
              {Array.from({ length: 1 }).map((_, idx) => (
                <SkeletonRow key={idx} length={6} />
              ))}
            </>
          )}
          {isError && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-red-500">
                Error fetching users
              </TableCell>
            </TableRow>
          )}
          {isSuccess && !data ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            isSuccess &&
            data && (
              <TableRow key={data.id} className="bg-muted/20">
                <TableCell>
                  <HoverCardForText data={data.id} tag="id" />
                </TableCell>
                <TableCell>{data.username}</TableCell>
                <TableCell>
                  <HoverCardForText data={data.email} tag="email" />
                </TableCell>
                <TableCell>
                  {data.createdAt &&
                    new Date(data.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {data.updatedAt &&
                    new Date(data.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button className="text-white">Edit</Button>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </>
  );
};

type RfidInfoTableDataProps = RFID & {
  accessLogs: AccessLog[];
  lastUsedAt: Date;
  accessAttempts: number;
  lastAccessDevice: Device;
  recentDevicesUsed: Device[];
  accessResultBreakdown: { DENIED: number; GRANTED: number };
};

type RfidInfoTableProps = {
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  data: RfidInfoTableDataProps[];
  isError: boolean;
};

const RfidInfoTable = ({
  isLoading,
  isFetching,
  isSuccess,
  data,
  isError,
}: RfidInfoTableProps) => {
  const [page, setPage] = useState<number>(1);
  return (
    <>
      <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold text-primary mt-4">
        RFID
      </h1>
      <p className="text-muted-foreground font-mono mt-2 text-sm w-3/4 md:text-md">
        RFID information about the user with the provided ID.
      </p>

      {/* RFID DATA  */}

      <div className="mt-4">
        <div className="py-4 overflow-auto rounded-md max-h-[60vh]">
          <Table className="border">
            <TableHeader>
              <TableRow className="bg-card sticky top-0 z-10">
                <TableCell className="font-semibold">Tag Id</TableCell>
                <TableCell className="font-semibold">Status</TableCell>
                <TableCell className="font-semibold">Created At</TableCell>
                <TableCell className="font-semibold">Last Used At</TableCell>
                <TableCell className="font-semibold">Access Attempts</TableCell>
                <TableCell className="font-semibold">
                  Last Access Device
                </TableCell>
                <TableCell className="font-semibold">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isLoading || isFetching) &&
                Array.from({ length: 3 }).map((_, idx) => (
                  <SkeletonRow key={idx} length={7} />
                ))}
              {isError && (
                <div className="text-red-500">
                  Error while fetching rfid data
                </div>
              )}
              {data &&
                data.map((rfid: RfidInfoTableDataProps) => (
                  <TableRow key={rfid.id}>
                    {/* TAG ID  */}
                    <TableCell>{rfid.tagId}</TableCell>

                    {/* STATUS  */}
                    <TableCell>
                      {rfid.active ? (
                        <Button className="border-emerald-300 border-1 text-white  bg-emerald-700/40">
                          Active
                        </Button>
                      ) : (
                        <Button variant={"outline"} className="text-white">
                          Inactive
                        </Button>
                      )}
                    </TableCell>

                    {/* Created At  */}
                    <TableCell>
                      {new Date(rfid.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* LAST USED AT  */}
                    <TableCell>
                      {new Date(rfid.lastUsedAt).toLocaleDateString()}
                    </TableCell>

                    {/* ACCESS ATTEMPTS  */}
                    <TableCell>{rfid.accessAttempts}</TableCell>

                    {/* LAST ACCESS DEVICE  */}
                    <TableCell>
                      {rfid.lastAccessDevice?.name || "N/A"}
                    </TableCell>

                    <TableCell>
                      <Button
                        className="text-white"
                        size="sm"
                        variant="default"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <PaginationBtns
              dataLength={data?.length || 0}
              isFetching={isFetching}
              isLoading={isLoading}
              setPage={setPage}
              page={page}
              divisor={6}
            />
          </div>
        </div>
      </div>
    </>
  );
};

type RfidActivityLogsTable = RfidInfoTableProps;

const ActivityLogsTable = ({
  isLoading,
  isFetching,
  isSuccess,
  data,
  isError,
}: RfidActivityLogsTable) => {
  return (
    <>
      <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold text-primary mt-8">
        Activity Logs
      </h1>
      <p className="text-muted-foreground font-mono mt-2 text-sm w-3/4 md:text-md">
        Logs of last devices accessed by rfid.
      </p>

      {/* RFID DATA  */}

      <div className="mt-4">
        <div className="py-4 overflow-auto rounded-md max-h-[60vh]">
          <Table className="border">
            <TableHeader>
              <TableRow className="bg-card sticky top-0 z-10">
                <TableCell className="font-semibold">Rfid Tag</TableCell>
                <TableCell className="font-semibold">Serial Number</TableCell>
                <TableCell className="font-semibold">Name</TableCell>
                <TableCell className="font-semibold">Location</TableCell>
                <TableCell className="font-semibold">Status</TableCell>
                <TableCell className="font-semibold">InstalledAt</TableCell>
                <TableCell className="font-semibold">Registered By</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isLoading || isFetching) &&
                Array.from({ length: 3 }).map((_, idx) => (
                  <SkeletonRow key={idx} length={7} />
                ))}
              {isError && (
                <div className="text-red-500">Error while fetching</div>
              )}
              {data &&
                data.map((rfid: RfidInfoTableDataProps) =>
                  rfid.recentDevicesUsed.map((device: Device) => (
                    <TableRow key={`${rfid.id}-${device.id}`}>
                      <TableCell>{rfid.tagId}</TableCell>
                      <TableCell>{device.serialNumber}</TableCell>
                      <TableCell>{device.name || "NA"}</TableCell>
                      <TableCell>{device.location || "NA"}</TableCell>
                      <TableCell>{device.status}</TableCell>
                      <TableCell>
                        {device.installedAt
                          ? new Date(device.installedAt).toLocaleDateString()
                          : "NA"}
                      </TableCell>
                      <TableCell>{device.registeredById || "NA"}</TableCell>
                    </TableRow>
                  ))
                )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

type AccessResultsTrendGraphProps = {
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  data: { histogram: { date: string; GRANTED: number; DENIED: number }[] };
};

const AccessResultsTrendGraph = ({
  isLoading,
  isFetching,
  isSuccess,
  data,
  isError,
}: AccessResultsTrendGraphProps) => {
  const chartData = data?.histogram;

  return (
    <div className="mt-8">
      <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold text-primary">
        Access Results Trend
      </h1>
      <p className="text-muted-foreground font-mono mt-2 text-sm w-3/4 md:text-md">
        Trend of access results.
      </p>

      {isLoading || isFetching ? (
        <div className="text-muted-foreground">
          <div className="bg-gray-700 mt-6 rounded-xl animate-pulse w-full h-[300px]"></div>
        </div>
      ) : isError ? (
        <div className="text-red-500">Error loading data</div>
      ) : (
        <Card className="mt-6">
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.3)"}}
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.7)", // shadcn card color
                    borderRadius: "0.75rem",
                    border: "1px solid rgb(0,0,0)",
                    color: "rgb(255,255,255)",
                  }}
                />
                <Legend
                  content={({ payload }) => (
                    <ul className="flex gap-4 mt-2">
                      {payload?.map((entry, index) => (
                        <li
                          key={`item-${index}`}
                          className="flex items-center gap-2"
                        >
                          <span
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm font-medium text-muted-foreground">
                            {entry.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                />

                <Bar
                  dataKey="GRANTED"
                  fill="#4ade80"
                  activeBar={{ fill: "#86efac" }} // lighter green on hover
                />
                <Bar
                  dataKey="DENIED"
                  fill="#f87171"
                  activeBar={{ fill: "#fca5a5" }} // lighter red on hover
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default page;
