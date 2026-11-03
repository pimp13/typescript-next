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
  users: {
    all: ["users"] as const,
    list: (params: { search: string; role: string }) =>
      ["users", "list", params] as const,
  },
  monitoring: {
    all: ["monitoring"] as const,
    overview: ["monitoring", "overview"] as const,
  },
} as const;
