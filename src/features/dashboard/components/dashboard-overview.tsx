"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import type { DashboardFiltersValues } from "@/features/dashboard/schemas";
import { ActivityFeed } from "@/features/dashboard/components/activity-feed";
import { DashboardFilters } from "@/features/dashboard/components/dashboard-filters";
import { RecentOrdersTable } from "@/features/dashboard/components/recent-orders-table";
import { RevenueChart } from "@/features/dashboard/components/revenue-chart";
import { StatsCards } from "@/features/dashboard/components/stats-cards";
import { Skeleton } from "@/components/ui/skeleton";

const initialFilters: DashboardFiltersValues = {
  range: "30d",
  status: "all",
  search: "",
};

export function DashboardOverview() {
  const router = useRouter();
  const { data: user, isLoading, isError, error } = useCurrentUser();
  const [filters, setFilters] = useState<DashboardFiltersValues>(initialFilters);

  const onFiltersChange = useCallback((next: DashboardFiltersValues) => {
    setFilters((prev) => {
      if (
        prev.range === next.range &&
        prev.status === next.status &&
        prev.search === next.search
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (isError && error instanceof ApiError && error.status === 401) {
      router.replace("/login");
    }
  }, [error, isError, router]);

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="grid gap-6">
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-[radial-gradient(circle_at_top_left,oklch(0.92_0.04_170),transparent_42%),linear-gradient(180deg,oklch(0.99_0_0),oklch(0.97_0.01_160))] p-5 dark:bg-[radial-gradient(circle_at_top_left,oklch(0.35_0.05_170),transparent_40%),linear-gradient(180deg,oklch(0.22_0.01_160),oklch(0.18_0.01_160))] md:p-6">
        <div className="relative z-10 max-w-2xl space-y-2">
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {user.name}
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            Your commerce pulse for today — metrics below are mocked so the UI
            can ship before the Fastify analytics endpoints exist.
          </p>
        </div>
      </section>

      <DashboardFilters values={filters} onChange={onFiltersChange} />
      <StatsCards range={filters.range} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]">
        <RevenueChart range={filters.range} />
        <ActivityFeed />
      </div>

      <RecentOrdersTable status={filters.status} search={filters.search} />
    </div>
  );
}
