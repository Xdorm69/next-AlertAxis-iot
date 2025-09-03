import { toast } from "sonner";

export async function UserManagementDataFetch() {
    try {
        const res = await fetch("/api/users");
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