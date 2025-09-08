import { HoverCardForText } from "@/app/(navLinks)/dashboard/_components/HoverCardForText";
import EmptyCell from "@/components/Table/EmptyCell";


// lib/date.ts
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export function RenderDate({date}: {date: Date | string}) {
  if(!isValidDate(date)) return <EmptyCell/>;

  return (
    <HoverCardForText
      data={[{ date: new Date(date).toDateString() }]}
      tag="Date"
      displayKey={formatDate(date)}
    />
  );
}
