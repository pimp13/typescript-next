"use client";

import type { MonitoringSnapshot } from "@/features/monitoring/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TrafficPanelProps = {
  traffic: MonitoringSnapshot["traffic"];
};

export function TrafficPanel({ traffic }: TrafficPanelProps) {
  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle>HTTP traffic</CardTitle>
        <CardDescription>
          Rolling window of the last {traffic.windowSeconds}s
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["2xx", traffic.statusBuckets["2xx"], "default"],
              ["3xx", traffic.statusBuckets["3xx"], "secondary"],
              ["4xx", traffic.statusBuckets["4xx"], "outline"],
              ["5xx", traffic.statusBuckets["5xx"], "destructive"],
            ] as const
          ).map(([label, count, variant]) => (
            <div
              key={label}
              className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge variant={variant}>{label}</Badge>
                <span className="text-lg font-semibold tabular-nums">{count}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead className="text-right">Hits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {traffic.topRoutes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-muted-foreground">
                    Waiting for traffic…
                  </TableCell>
                </TableRow>
              ) : (
                traffic.topRoutes.map((item) => (
                  <TableRow key={item.route}>
                    <TableCell className="font-mono text-xs sm:text-sm">
                      {item.route}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {item.count}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
