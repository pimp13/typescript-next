"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/features/dashboard/api";
import { queryKeys } from "@/lib/query/keys";
import type { DashboardRange, OrderStatus } from "@/types/dashboard";

export function useDashboardStats(range: DashboardRange) {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(range),
    queryFn: () => dashboardApi.getStats(range),
  });
}

export function useRevenueSeries(range: DashboardRange) {
  return useQuery({
    queryKey: queryKeys.dashboard.revenue(range),
    queryFn: () => dashboardApi.getRevenue(range),
  });
}

export function useRecentOrders(status: OrderStatus) {
  return useQuery({
    queryKey: queryKeys.dashboard.orders(status),
    queryFn: () => dashboardApi.getOrders(status),
  });
}

export function useActivityFeed() {
  return useQuery({
    queryKey: queryKeys.dashboard.activity,
    queryFn: () => dashboardApi.getActivity(),
  });
}
