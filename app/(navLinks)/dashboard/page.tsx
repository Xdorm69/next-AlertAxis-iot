import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import DashboardPage from "./_components/Pages/DashboardPage";
import { fetchDashboardData } from "./_fetch/fetchData";


export default async function Page() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["dashboard", "admin", "ALL", "ALL", 1, "", "", ""],
    queryFn: () =>
      fetchDashboardData({
        statusFilter: "ALL",
        roleFilter: "ALL",
        page: 1,
        dateFrom: "",
        dateTo: "",
        search: "",
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardPage />
    </HydrationBoundary>
  );
}
