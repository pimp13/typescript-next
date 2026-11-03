"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { format, parseISO } from "date-fns";
import { useRevenueSeries } from "@/features/dashboard/hooks/use-dashboard";
import type { DashboardRange } from "@/types/dashboard";
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
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type RevenueChartProps = {
  range: DashboardRange;
};

export function RevenueChart({ range }: RevenueChartProps) {
  const { data, isLoading, isError } = useRevenueSeries(range);

  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle>Revenue trend</CardTitle>
        <CardDescription>
          Mock daily revenue and order volume for the selected range.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="aspect-video w-full rounded-xl" />
        ) : isError || !data ? (
          <p className="text-sm text-muted-foreground">
            Unable to load revenue series.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
            <AreaChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={28}
                tickFormatter={(value: string) =>
                  format(parseISO(value), range === "7d" ? "EEE" : "MMM d")
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      typeof value === "string"
                        ? format(parseISO(value), "MMM d, yyyy")
                        : String(value)
                    }
                    indicator="line"
                  />
                }
              />
              <Area
                dataKey="revenue"
                type="natural"
                fill="url(#fillRevenue)"
                stroke="var(--color-revenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
