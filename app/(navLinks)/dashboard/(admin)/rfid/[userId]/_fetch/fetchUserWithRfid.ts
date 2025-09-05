import { toast } from "sonner";

export const fetchUserWithRfid = async (userId: string) => {
  try {
    const res = await fetch(`/api/users/${userId}`, {method: "PATCH"});
    const data = await res.json();
    if (res.ok) {
      return data;
    }
    toast.error(data.error || "Error while fetching rfid data for user");
    throw new Error("Failed to fetch data");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
