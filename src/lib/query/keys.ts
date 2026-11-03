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
  chan: {
    all: ["chan"] as const,
    boards: ["chan", "boards"] as const,
    threads: (
      slug: string,
      params: { mode: string; page: number },
    ) => ["chan", "threads", slug, params] as const,
    thread: (slug: string, threadId: string) =>
      ["chan", "thread", slug, threadId] as const,
  },
  chanAdmin: {
    all: ["chan-admin"] as const,
    stats: ["chan-admin", "stats"] as const,
    boards: ["chan-admin", "boards"] as const,
    threads: ["chan-admin", "threads"] as const,
    posts: ["chan-admin", "posts"] as const,
    bans: ["chan-admin", "bans"] as const,
  },
} as const;
