import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface SectionHeaderProps {
  title: string;
  description: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 p-0"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
      {isExpanded && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
