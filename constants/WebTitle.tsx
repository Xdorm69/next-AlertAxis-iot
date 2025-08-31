import { cn } from "@/lib/utils";

export const WebTitle = ({
  className,
  glow,
}: {
  className?: string;
  glow?: boolean;
}) => {
  return (
    <div className={cn("font-semibold font-sans", className)}>
      <span
        className={cn("text-primary", glow && "text-shadow-glow text-white/80")}
      >
        Alert
      </span>
      <span>Axis</span>
    </div>
  );
};
