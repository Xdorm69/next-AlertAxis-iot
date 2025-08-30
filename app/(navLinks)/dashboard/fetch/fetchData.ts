
type fetchDashboardDataProps = {
    statusFilter: string;
    roleFilter: string;
}
export const fetchDashboardData = async ({statusFilter, roleFilter}: fetchDashboardDataProps) => {
  try {
    const res = await fetch(`/api/dashboard?statusFilter=${statusFilter}&roleFilter=${roleFilter}`);
    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }
    return res.json();

  } catch (error) {
    console.log(error);
    return error;
  }
};
