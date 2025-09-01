import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export const HoverCardForText = ({
  data,
  tag,
}: {
  data: string;
  tag: string;
}) => {
  const handleClick = () => {
    navigator.clipboard.writeText(data);
    toast.success("Copied to clipboard ✅");
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="font-mono truncate max-w-[150px] rounded-lg shadow-sm hover:bg-muted/80"
        >
          {data.slice(0, 15) + "..."}
        </Button>
      </HoverCardTrigger>

      <HoverCardContent className="w-72 p-3 rounded-xl shadow-lg border bg-popover">
        <p className="text-[10px] font-mono font-semibold uppercase tracking-wide text-primary mb-1">
          {tag}
        </p>

        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-sm break-all text-foreground/90">
            {data}
          </p>

          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-muted rounded-md"
            onClick={handleClick}
          >
            <Copy className="size-4 text-muted-foreground" />
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
