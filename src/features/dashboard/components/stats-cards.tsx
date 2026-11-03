"use client";

import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-react";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard";
import type { DashboardRange } from "@/types/dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type StatsCardsProps = {
  range: DashboardRange;
};

export function StatsCards({ range }: StatsCardsProps) {
  const { data, isLoading, isError } = useDashboardStats(range);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-border/70">
            <CardHeader className="gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle>Could not load stats</CardTitle>
          <CardDescription>Mock data request failed.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {data.map((stat, index) => {
        const TrendIcon =
          stat.trend === "up" ? ArrowUpRightIcon : ArrowDownRightIcon;

        return (
          <Card
            key={stat.id}
            className="border-border/70 bg-linear-to-br from-card to-muted/20 shadow-none transition-transform duration-300 hover:-translate-y-0.5"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                {stat.value}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">{stat.description}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium",
                  stat.trend === "up"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400",
                )}
              >
                <TrendIcon className="size-3.5" />
                {stat.delta}%
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
