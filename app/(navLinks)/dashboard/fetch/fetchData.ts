
type fetchDashboardDataProps = {
    statusFilter: string;
    roleFilter: string;
    page: number;
    dateFrom: string;
    dateTo: string;
    search: string;
}
export const fetchDashboardData = async ({statusFilter, roleFilter, page, dateFrom, dateTo, search}: fetchDashboardDataProps) => {
  try {
    const res = await fetch(`/api/dashboard?statusFilter=${statusFilter}&roleFilter=${roleFilter}&page=${page}&dateFrom=${dateFrom}&dateTo=${dateTo}&search=${search}`);
    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }
    return res.json();

  } catch (error) {
    console.log(error);
    return error;
  }
};
