"use client";

import { formatUptime } from "@/features/monitoring/lib/format";
import type { MonitoringSnapshot } from "@/features/monitoring/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SystemPanelProps = {
  snapshot: MonitoringSnapshot;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/50 py-2 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
}

export function SystemPanel({ snapshot }: SystemPanelProps) {
  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle>Host & runtime</CardTitle>
        <CardDescription>Machine and Node.js process details</CardDescription>
      </CardHeader>
      <CardContent>
        <Row label="Hostname" value={snapshot.host.hostname} />
        <Row label="Host uptime" value={formatUptime(snapshot.host.uptimeSeconds)} />
        <Row
          label="Process uptime"
          value={formatUptime(snapshot.process.uptimeSeconds)}
        />
        <Row label="Node" value={snapshot.process.nodeVersion} />
        <Row
          label="Platform"
          value={`${snapshot.process.platform}/${snapshot.process.arch}`}
        />
        <Row label="PID" value={String(snapshot.process.pid)} />
        <Row label="CPU cores" value={String(snapshot.host.cpuCount)} />
        <Row
          label="Load average"
          value={snapshot.host.loadAverage.join(" · ")}
        />
        <Row
          label="Host memory"
          value={`${snapshot.host.memory.usedMb} / ${snapshot.host.memory.totalMb} MB`}
        />
        <Row
          label="Heap"
          value={`${snapshot.process.memory.heapUsedMb} / ${snapshot.process.memory.heapTotalMb} MB`}
        />
      </CardContent>
    </Card>
  );
}
