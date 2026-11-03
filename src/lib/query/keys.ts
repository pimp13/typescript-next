export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    stats: (range: string) => ["dashboard", "stats", range] as const,
    revenue: (range: string) => ["dashboard", "revenue", range] as const,
    orders: (status: string) => ["dashboard", "orders", status] as const,
    activity: ["dashboard", "activity"] as const,
  },
} as const;
