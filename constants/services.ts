import rfid from "@/public/services/rfid.json";
import real from "@/public/services/real2.json";
import db from "@/public/services/db2.json";

export type ServiceCardProps = {
  title: string;
  desc: string;
  animation: object;
  className?: string;
};

export const CardData: ServiceCardProps[] = [
  {
    title: "RFID Access Control",
    desc: "Secure home entry with RFID technology",
    animation: rfid,
  },
  {
    title: "Real Time Monitoring",
    desc: "View logs instantly",
    animation: real,
  },
  {
    title: "Secure Database",
    desc: "Only the last 30 transactions stored for safety.",
    animation: db,
  },
];
