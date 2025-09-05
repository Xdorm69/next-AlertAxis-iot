import { toast } from "sonner";

export const fetchRfidChartWithUserId = async (userId: string) => {
  try {
    const res = await fetch(`/api/rfid/chart/${userId}?days=10`);
    const data = await res.json();
    if (res.ok) {
      return data;
    }
    toast.error(data.error || "Error while fetching rfid chart data for user");
    throw new Error("Failed to fetch data");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
