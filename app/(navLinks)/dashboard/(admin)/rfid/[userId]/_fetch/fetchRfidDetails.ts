import { toast } from "sonner";

export const fetchRfidDetailsWithUserId = async (userId: string) => {
  try {
    const res = await fetch(`/api/rfid/details/${userId}`);
    const data = await res.json();
    if (res.ok) {
      return data;
    }
    toast.error(data.error || "Error while fetching rfid details for user");
    throw new Error("Failed to fetch data");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
