import { HoverCardForText } from "@/app/(navLinks)/dashboard/_components/HoverCardForText";

// lib/date.ts
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function RenderDate(date: Date | string) {
  return (
    <HoverCardForText
      data={[{ date: new Date(date).toLocaleDateString() }]}
      tag="Date"
      displayKey={formatDate(date)}
    />
  );
}
