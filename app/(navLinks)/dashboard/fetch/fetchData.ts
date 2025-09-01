import { DateRange } from "react-day-picker";

type fetchDashboardDataProps = {
    statusFilter: string;
    roleFilter: string;
    page: number;
    dateFrom: string;
    dateTo: string;
}
export const fetchDashboardData = async ({statusFilter, roleFilter, page, dateFrom, dateTo}: fetchDashboardDataProps) => {
  try {
    const res = await fetch(`/api/dashboard?statusFilter=${statusFilter}&roleFilter=${roleFilter}&page=${page}&dateFrom=${dateFrom}&dateTo=${dateTo}`);
    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }
    return res.json();

  } catch (error) {
    console.log(error);
    return error;
  }
};
