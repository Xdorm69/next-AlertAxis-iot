// hooks/useRfid.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { defaultQueryOptions } from "@/lib/helpers/queryOptions";


export const useRfidData = (userId: string) =>
  useQuery({
    queryKey: ["rfid-data", userId],
    queryFn: () => apiFetch(`/api/rfid/${userId}`),
    ...defaultQueryOptions
  });

export const useChangeRfidStatus = (userId: string) =>
  useMutation({
    mutationKey: ["change-rfid-status-user"],
    mutationFn: ({
      tagId,
      requestType,
    }: {
      tagId: string;
      requestType: string;
    }) =>
      apiFetch("/api/rfid/add-rfid-user", {
        method: "POST",
        body: JSON.stringify({ userId, tagId, requestType }),
      }),
    onMutate: () => toast.loading("Toggling Status...", { id: "rfid-status" }),
    onSuccess: () =>
      toast.success("Status changed successfully", { id: "rfid-status" }),
    onError: (err: { error: string }) =>
      toast.error(err.error || "Failed to change status", {
        id: "rfid-status",
      }),
  });
