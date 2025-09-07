import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Copy } from "lucide-react";
import { toast } from "sonner";

type HoverCardForTextProps = {
  data: string | Record<string, any>[]; // array of objects or string
  tag: string;
  displayKey?: string; // optional trigger text
};

export const HoverCardForText = ({
  data,
  tag,
  displayKey,
}: HoverCardForTextProps) => {
  const handleClick = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard ✅");
  };

  const renderTrigger = (text: string) => (
    <Button
      variant="ghost"
      size="sm"
      className="font-mono truncate max-w-[150px] rounded-lg shadow-sm hover:bg-muted/80"
    >
      {text.length > 15 ? text.slice(0, 15) + "..." : text}
    </Button>
  );

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {Array.isArray(data)
          ? renderTrigger(displayKey || `${data.length} ${tag}(s)`)
          : renderTrigger(data)}
      </HoverCardTrigger>

      <HoverCardContent className="w-80 p-3 rounded-xl shadow-lg border bg-popover max-h-64 overflow-auto">
        <p className="text-[10px] font-mono font-semibold uppercase tracking-wide text-primary mb-2">
          {tag}
        </p>

        {Array.isArray(data) ? (
          <div className="flex flex-col gap-3">
            {data.map((obj, idx) => (
              <div key={idx} className="border-b last:border-0 pb-2 last:pb-0">
                {Object.entries(obj).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-2 mb-1"
                  >
                    <p className="font-mono text-xs text-muted-foreground min-w-[60px]">
                      {key}:
                    </p>
                    <p className="font-mono text-sm break-all text-foreground/90 flex-1">
                      {String(value)}
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-muted rounded-md"
                      onClick={() => handleClick(String(value))}
                    >
                      <Copy className="size-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-sm break-all text-foreground/90">
              {data}
            </p>
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-muted rounded-md"
              onClick={() => handleClick(data)}
            >
              <Copy className="size-4 text-muted-foreground" />
            </Button>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
