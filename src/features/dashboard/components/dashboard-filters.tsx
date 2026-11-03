"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon } from "lucide-react";
import {
  dashboardFiltersSchema,
  type DashboardFiltersValues,
} from "@/features/dashboard/schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DashboardFiltersProps = {
  values: DashboardFiltersValues;
  onChange: (values: DashboardFiltersValues) => void;
};

export function DashboardFilters({ values, onChange }: DashboardFiltersProps) {
  const { control, register, watch } = useForm<DashboardFiltersValues>({
    resolver: zodResolver(dashboardFiltersSchema),
    defaultValues: values,
  });

  useEffect(() => {
    const subscription = watch((formValues) => {
      const parsed = dashboardFiltersSchema.safeParse(formValues);
      if (parsed.success) {
        onChange(parsed.data);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <form className="grid gap-3 rounded-xl border border-border/70 bg-card/60 p-3 sm:grid-cols-[10rem_10rem_minmax(0,1fr)]">
      <div className="grid gap-1.5">
        <Label htmlFor="range">Range</Label>
        <Controller
          control={control}
          name="range"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                if (value) field.onChange(value);
              }}
            >
              <SelectTrigger id="range" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="status">Order status</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                if (value) field.onChange(value);
              }}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="search">Search orders</Label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            className="pl-8"
            placeholder="Order ID, customer, email..."
            {...register("search")}
          />
        </div>
      </div>
    </form>
  );
}
