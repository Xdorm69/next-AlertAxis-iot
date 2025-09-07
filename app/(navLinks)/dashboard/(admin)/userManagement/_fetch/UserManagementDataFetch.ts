import { DateRange } from "react-day-picker";
import { toast } from "sonner";

export async function UserManagementDataFetch(
  search: string,
  roleFilter: string,
  date: DateRange | undefined,
  page: number
) {
  try {
    const res = await fetch(
      `/api/users?search=${search}&roleFilter=${roleFilter}&dateFrom=${date?.from?.toISOString()}&dateTo=${date?.to?.toISOString()}&page=${page}`
    );
    const data = await res.json();
    if (res.ok) {
      return data;
    }
    toast.error(data.error || "Error while fetching users");
    throw new Error("Failed to fetch data");
  } catch (error) {
    console.log(error);
    throw error;
  }
}
