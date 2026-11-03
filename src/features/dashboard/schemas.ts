import { z } from "zod";

export const dashboardFiltersSchema = z.object({
  range: z.enum(["7d", "30d", "90d"]),
  status: z.enum(["all", "paid", "pending", "refunded"]),
  search: z.string().max(80),
});

export type DashboardFiltersValues = z.infer<typeof dashboardFiltersSchema>;
