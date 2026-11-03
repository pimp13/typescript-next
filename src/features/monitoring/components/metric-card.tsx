"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  progress?: number;
  tone?: "default" | "good" | "warn" | "bad";
};

const toneClass: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  default: "from-card to-muted/20",
  good: "from-emerald-500/10 to-card",
  warn: "from-amber-500/10 to-card",
  bad: "from-rose-500/10 to-card",
};

export function MetricCard({
  label,
  value,
  hint,
  icon,
  progress,
  tone = "default",
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "border-border/70 bg-linear-to-br shadow-none transition-transform duration-300 hover:-translate-y-0.5",
        toneClass[tone],
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <div className="space-y-1">
          <CardDescription>{label}</CardDescription>
          <CardTitle className="text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </CardTitle>
        </div>
        {icon ? (
          <div className="rounded-lg border border-border/60 bg-background/70 p-2 text-muted-foreground">
            {icon}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-2">
        {typeof progress === "number" ? (
          <Progress value={Math.min(100, Math.max(0, progress))} />
        ) : null}
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
