import { useQuery } from "@tanstack/react-query";
import { DataTable, Column } from "./DataTable";
import { ApiResponse } from "@/Types/api";


export function FetchTable<T>({
  queryKey,
  queryFn,
  columns,
}: {
  queryKey: string[];
  queryFn: () => Promise<ApiResponse<T>>;
  columns: Column<T>[];
}) {
  const {
    data: res,
    isLoading,
    isError,
  } = useQuery<ApiResponse<T>>({
    queryKey,
    queryFn,
  });

  const data = res?.data;

  return <DataTable isLoading={isLoading} isError={isError} data={data || []} columns={columns} />;
}
