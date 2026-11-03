import type {
  ActivityItem,
  DashboardRange,
  DashboardStat,
  Order,
  OrderStatus,
  RevenuePoint,
} from "@/types/dashboard";

function delay(ms = 450) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const statsByRange: Record<DashboardRange, DashboardStat[]> = {
  "7d": [
    {
      id: "revenue",
      label: "Revenue",
      value: "$24,820",
      delta: 12.4,
      trend: "up",
      description: "vs previous 7 days",
    },
    {
      id: "orders",
      label: "Orders",
      value: "1,284",
      delta: 8.1,
      trend: "up",
      description: "Completed checkouts",
    },
    {
      id: "customers",
      label: "Active customers",
      value: "3,912",
      delta: 3.2,
      trend: "up",
      description: "Returning this week",
    },
    {
      id: "conversion",
      label: "Conversion",
      value: "4.8%",
      delta: 0.6,
      trend: "down",
      description: "Visit to purchase",
    },
  ],
  "30d": [
    {
      id: "revenue",
      label: "Revenue",
      value: "$96,440",
      delta: 18.7,
      trend: "up",
      description: "vs previous 30 days",
    },
    {
      id: "orders",
      label: "Orders",
      value: "4,902",
      delta: 11.3,
      trend: "up",
      description: "Completed checkouts",
    },
    {
      id: "customers",
      label: "Active customers",
      value: "12,480",
      delta: 6.9,
      trend: "up",
      description: "Returning this month",
    },
    {
      id: "conversion",
      label: "Conversion",
      value: "5.1%",
      delta: 0.4,
      trend: "up",
      description: "Visit to purchase",
    },
  ],
  "90d": [
    {
      id: "revenue",
      label: "Revenue",
      value: "$278,120",
      delta: 22.1,
      trend: "up",
      description: "vs previous 90 days",
    },
    {
      id: "orders",
      label: "Orders",
      value: "14,220",
      delta: 9.4,
      trend: "up",
      description: "Completed checkouts",
    },
    {
      id: "customers",
      label: "Active customers",
      value: "31,050",
      delta: 14.2,
      trend: "up",
      description: "Returning this quarter",
    },
    {
      id: "conversion",
      label: "Conversion",
      value: "4.9%",
      delta: 0.2,
      trend: "down",
      description: "Visit to purchase",
    },
  ],
};

function buildRevenue(range: DashboardRange): RevenuePoint[] {
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const now = new Date("2026-11-03T12:00:00Z");

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(now);
    date.setUTCDate(now.getUTCDate() - (days - 1 - index));
    const wave = Math.sin(index / 4) * 1800 + Math.cos(index / 7) * 900;
    const revenue = Math.round(4200 + wave + index * 35);
    const orders = Math.round(revenue / 78);

    return {
      date: date.toISOString().slice(0, 10),
      revenue,
      orders,
    };
  });
}

const orders: Order[] = [
  {
    id: "ORD-1042",
    customer: "Sara Mohammadi",
    email: "sara@example.com",
    amount: 186,
    status: "paid",
    createdAt: "2026-11-03T08:12:00Z",
  },
  {
    id: "ORD-1041",
    customer: "Ali Rezaei",
    email: "ali@example.com",
    amount: 92,
    status: "pending",
    createdAt: "2026-11-03T07:41:00Z",
  },
  {
    id: "ORD-1040",
    customer: "Neda Karimi",
    email: "neda@example.com",
    amount: 248,
    status: "paid",
    createdAt: "2026-11-02T21:18:00Z",
  },
  {
    id: "ORD-1039",
    customer: "Hamed Ahmadi",
    email: "hamed@example.com",
    amount: 64,
    status: "refunded",
    createdAt: "2026-11-02T18:05:00Z",
  },
  {
    id: "ORD-1038",
    customer: "Mina Farhadi",
    email: "mina@example.com",
    amount: 312,
    status: "paid",
    createdAt: "2026-11-02T14:33:00Z",
  },
  {
    id: "ORD-1037",
    customer: "Reza Ghasemi",
    email: "reza@example.com",
    amount: 129,
    status: "pending",
    createdAt: "2026-11-01T19:27:00Z",
  },
  {
    id: "ORD-1036",
    customer: "Leila Sadeghi",
    email: "leila@example.com",
    amount: 54,
    status: "paid",
    createdAt: "2026-11-01T11:09:00Z",
  },
  {
    id: "ORD-1035",
    customer: "Pouya Nouri",
    email: "pouya@example.com",
    amount: 410,
    status: "paid",
    createdAt: "2026-10-31T22:44:00Z",
  },
];

const activities: ActivityItem[] = [
  {
    id: "act-1",
    title: "New order received",
    description: "ORD-1042 · $186 from Sara Mohammadi",
    timestamp: "2026-11-03T08:12:00Z",
    type: "order",
  },
  {
    id: "act-2",
    title: "Customer signed up",
    description: "mina.farhadi joined Funlife",
    timestamp: "2026-11-03T07:58:00Z",
    type: "user",
  },
  {
    id: "act-3",
    title: "Payout processed",
    description: "Weekly settlement of $12,480 completed",
    timestamp: "2026-11-03T06:30:00Z",
    type: "billing",
  },
  {
    id: "act-4",
    title: "Inventory sync",
    description: "Catalog refreshed from warehouse feed",
    timestamp: "2026-11-02T23:10:00Z",
    type: "system",
  },
  {
    id: "act-5",
    title: "Refund issued",
    description: "ORD-1039 refunded to Hamed Ahmadi",
    timestamp: "2026-11-02T18:20:00Z",
    type: "billing",
  },
];

export async function getDashboardStats(range: DashboardRange) {
  await delay();
  return statsByRange[range];
}

export async function getRevenueSeries(range: DashboardRange) {
  await delay();
  return buildRevenue(range);
}

export async function getRecentOrders(status: OrderStatus = "all") {
  await delay(350);
  if (status === "all") return orders;
  return orders.filter((order) => order.status === status);
}

export async function getActivityFeed() {
  await delay(300);
  return activities;
}
