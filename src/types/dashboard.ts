export type DashboardRange = "7d" | "30d" | "90d";

export type OrderStatus = "all" | "paid" | "pending" | "refunded";

export type DashboardStat = {
  id: string;
  label: string;
  value: string;
  delta: number;
  trend: "up" | "down";
  description: string;
};

export type RevenuePoint = {
  date: string;
  revenue: number;
  orders: number;
};

export type Order = {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: Exclude<OrderStatus, "all">;
  createdAt: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "order" | "user" | "system" | "billing";
};
