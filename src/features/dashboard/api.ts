import {
  getActivityFeed,
  getDashboardStats,
  getRecentOrders,
  getRevenueSeries,
} from "@/mocks/dashboard";
import type { DashboardRange, OrderStatus } from "@/types/dashboard";

export const dashboardApi = {
  getStats: (range: DashboardRange) => getDashboardStats(range),
  getRevenue: (range: DashboardRange) => getRevenueSeries(range),
  getOrders: (status: OrderStatus) => getRecentOrders(status),
  getActivity: () => getActivityFeed(),
};
