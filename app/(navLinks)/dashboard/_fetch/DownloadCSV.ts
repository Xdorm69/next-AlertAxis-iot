import { AccessLogWithUser } from "@/app/api/dashboard/route";
import Papa from "papaparse";

export const DownloadCSV = (data: AccessLogWithUser[]) => {
  // Flatten objects
  const flatData = data.map((log) => ({
    id: log.id,
    timestamp: log.timestamp,
    status: log.status,
    userName: log.user.name,
    userEmail: log.user.email,
    userRole: log.user.role,
    rfidTag: log.rfid.tagId,
  }));

  const csv = Papa.unparse(flatData);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "dashboard_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
