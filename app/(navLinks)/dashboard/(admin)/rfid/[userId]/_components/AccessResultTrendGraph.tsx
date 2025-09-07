"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchRfidChartWithUserId } from "../_fetch/fetchRfidChart";
import { defaultQueryOptions } from "@/lib/helpers/queryOptions";

export const AccessResultsTrendGraph = ({userId}: {userId: string}) => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["rfid-chart", userId],
    queryFn: () => fetchRfidChartWithUserId(userId),
    ...defaultQueryOptions
  });

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
                  cursor={{ fill: "rgba(0,0,0,0.3)" }}
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
