"use client";

import { LayoutGridIcon, TableIcon } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

export type ArticlesViewMode = "grid" | "table";

type ArticlesViewToggleProps = {
  value: ArticlesViewMode;
  onChange: (value: ArticlesViewMode) => void;
};

const options: {
  value: ArticlesViewMode;
  label: string;
  icon: typeof LayoutGridIcon;
}[] = [
  { value: "grid", label: "Cards", icon: LayoutGridIcon },
  { value: "table", label: "Table", icon: TableIcon },
];

export function ArticlesViewToggle({
  value,
  onChange,
}: ArticlesViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Articles view"
      className="inline-flex rounded-xl border border-border/70 bg-card/70 p-1 backdrop-blur-sm"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const active = value === option.value;

        return (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant="ghost"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "gap-1.5 rounded-lg px-3 transition-all",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
            <span className="hidden sm:inline">{option.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
