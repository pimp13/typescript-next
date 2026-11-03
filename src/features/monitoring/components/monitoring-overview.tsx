"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ActivityIcon,
  CpuIcon,
  DatabaseIcon,
  MemoryStickIcon,
  RadioIcon,
  ServerIcon,
  TimerIcon,
  ZapIcon,
} from "lucide-react";
import { ApiError } from "@/lib/api";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useLiveMonitoring } from "@/features/monitoring/hooks/use-live-monitoring";
import { formatUptime } from "@/features/monitoring/lib/format";
import { LiveCharts } from "@/features/monitoring/components/live-charts";
import { MetricCard } from "@/features/monitoring/components/metric-card";
import { SystemPanel } from "@/features/monitoring/components/system-panel";
import { TrafficPanel } from "@/features/monitoring/components/traffic-panel";
import { UsersPanel } from "@/features/monitoring/components/users-panel";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function streamLabel(state: "connecting" | "live" | "polling" | "error") {
  switch (state) {
    case "live":
      return "Live SSE";
    case "polling":
      return "Polling fallback";
    case "error":
      return "Reconnecting";
    default:
      return "Connecting";
  }
}

export function MonitoringOverview() {
  const router = useRouter();
  const { data: currentUser, isLoading: isAuthLoading, isError, error } =
    useCurrentUser();
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  const {
    snapshot,
    history,
    streamState,
    lastUpdatedAt,
    isLoading,
    isError: isMonitoringError,
  } = useLiveMonitoring(Boolean(isSuperAdmin));

  useEffect(() => {
    if (isError && error instanceof ApiError && error.status === 401) {
      router.replace("/login");
    }
  }, [error, isError, router]);

  useEffect(() => {
    if (!isAuthLoading && currentUser && currentUser.role !== "SUPER_ADMIN") {
      router.replace("/dashboard");
    }
  }, [currentUser, isAuthLoading, router]);

  if (isAuthLoading || !currentUser) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  if (isLoading || !snapshot) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-xl" />
          ))}
        </div>
        {isMonitoringError ? (
          <p className="text-sm text-destructive">
            Could not load monitoring data. Confirm the API is running and you
            are signed in as a super admin.
          </p>
        ) : null}
      </div>
    );
  }

  const cpuTone =
    snapshot.process.cpuPercent > 85
      ? "bad"
      : snapshot.process.cpuPercent > 60
        ? "warn"
        : "good";
  const memTone =
    snapshot.host.memory.usedPercent > 90
      ? "bad"
      : snapshot.host.memory.usedPercent > 75
        ? "warn"
        : "good";
  const dbTone = snapshot.database.status === "up" ? "good" : "bad";

  return (
    <div className="grid gap-6">
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-[radial-gradient(circle_at_top_left,oklch(0.9_0.05_170),transparent_40%),linear-gradient(135deg,oklch(0.99_0_0),oklch(0.96_0.02_220))] p-5 dark:bg-[radial-gradient(circle_at_top_left,oklch(0.34_0.06_170),transparent_42%),linear-gradient(135deg,oklch(0.22_0.02_220),oklch(0.18_0.01_170))] md:p-6">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={snapshot.status === "healthy" ? "success" : "destructive"}
                className="gap-1.5"
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    snapshot.status === "healthy"
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-rose-500 animate-pulse",
                  )}
                />
                {snapshot.status === "healthy" ? "Healthy" : "Degraded"}
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <RadioIcon className="size-3.5" />
                {streamLabel(streamState)}
              </Badge>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Live system monitoring
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              Real-time process, host, database, and traffic telemetry reserved
              for super admins.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-xs text-muted-foreground backdrop-blur">
            Last update{" "}
            <span className="font-medium text-foreground">
              {lastUpdatedAt
                ? new Date(lastUpdatedAt).toLocaleTimeString()
                : "—"}
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="CPU"
          value={`${snapshot.process.cpuPercent.toFixed(1)}%`}
          hint={`${snapshot.host.cpuCount} cores · load ${snapshot.host.loadAverage[0]}`}
          progress={snapshot.process.cpuPercent}
          tone={cpuTone}
          icon={<CpuIcon className="size-4" />}
        />
        <MetricCard
          label="Host memory"
          value={`${snapshot.host.memory.usedPercent.toFixed(1)}%`}
          hint={`${snapshot.host.memory.usedMb} / ${snapshot.host.memory.totalMb} MB`}
          progress={snapshot.host.memory.usedPercent}
          tone={memTone}
          icon={<MemoryStickIcon className="size-4" />}
        />
        <MetricCard
          label="Database"
          value={snapshot.database.status.toUpperCase()}
          hint={`${snapshot.database.latencyMs} ms latency`}
          tone={dbTone}
          icon={<DatabaseIcon className="size-4" />}
        />
        <MetricCard
          label="Throughput"
          value={`${snapshot.traffic.requestsPerSecond.toFixed(2)} rps`}
          hint={`${snapshot.traffic.requestsInWindow} req · ${snapshot.traffic.avgLatencyMs} ms avg`}
          tone={snapshot.traffic.errorRate > 5 ? "warn" : "default"}
          icon={<ZapIcon className="size-4" />}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Process uptime"
          value={formatUptime(snapshot.process.uptimeSeconds)}
          hint={`PID ${snapshot.process.pid}`}
          icon={<TimerIcon className="size-4" />}
        />
        <MetricCard
          label="Heap used"
          value={`${snapshot.process.memory.heapUsedMb} MB`}
          hint={`RSS ${snapshot.process.memory.rssMb} MB`}
          icon={<ServerIcon className="size-4" />}
        />
        <MetricCard
          label="Error rate"
          value={`${snapshot.traffic.errorRate.toFixed(2)}%`}
          hint="5xx share in rolling window"
          tone={snapshot.traffic.errorRate > 2 ? "bad" : "good"}
          icon={<ActivityIcon className="size-4" />}
        />
        <MetricCard
          label="Active users"
          value={String(snapshot.users.active)}
          hint={`${snapshot.users.total} accounts total`}
          icon={<RadioIcon className="size-4" />}
        />
      </div>

      <LiveCharts history={history} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <TrafficPanel traffic={snapshot.traffic} />
        <UsersPanel users={snapshot.users} />
        <SystemPanel snapshot={snapshot} />
      </div>
    </div>
  );
}
