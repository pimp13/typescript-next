"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { MonitoringHistoryPoint } from "@/features/monitoring/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const resourceConfig = {
  cpu: { label: "CPU %", color: "var(--chart-1)" },
  heap: { label: "Heap MB", color: "var(--chart-2)" },
} satisfies ChartConfig;

const trafficConfig = {
  rps: { label: "Req/s", color: "var(--chart-3)" },
  dbLatency: { label: "DB ms", color: "var(--chart-4)" },
} satisfies ChartConfig;

type LiveChartsProps = {
  history: MonitoringHistoryPoint[];
};

export function LiveCharts({ history }: LiveChartsProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="border-border/70 shadow-none">
        <CardHeader>
          <CardTitle>Runtime pressure</CardTitle>
          <CardDescription>Live CPU and heap usage</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={resourceConfig}
            className="aspect-auto h-64 w-full"
          >
            <AreaChart data={history} margin={{ left: 4, right: 4, top: 8 }}>
              <defs>
                <linearGradient id="fillCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-cpu)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-cpu)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="time" tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis tickLine={false} axisLine={false} width={36} />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Area
                type="monotone"
                dataKey="cpu"
                stroke="var(--color-cpu)"
                fill="url(#fillCpu)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="heap"
                stroke="var(--color-heap)"
                fill="transparent"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-none">
        <CardHeader>
          <CardTitle>Traffic & latency</CardTitle>
          <CardDescription>Requests per second and DB ping</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={trafficConfig}
            className="aspect-auto h-64 w-full"
          >
            <AreaChart data={history} margin={{ left: 4, right: 4, top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="time" tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis tickLine={false} axisLine={false} width={36} />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Area
                type="monotone"
                dataKey="rps"
                stroke="var(--color-rps)"
                fill="var(--color-rps)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="dbLatency"
                stroke="var(--color-dbLatency)"
                fill="transparent"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
