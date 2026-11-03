"use client";

import { format, parseISO } from "date-fns";
import { useRecentOrders } from "@/features/dashboard/hooks/use-dashboard";
import type { OrderStatus } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RecentOrdersTableProps = {
  status: OrderStatus;
  search: string;
};

const statusVariant: Record<
  Exclude<OrderStatus, "all">,
  "default" | "secondary" | "outline" | "destructive"
> = {
  paid: "default",
  pending: "secondary",
  refunded: "outline",
};

export function RecentOrdersTable({ status, search }: RecentOrdersTableProps) {
  const { data, isLoading, isError } = useRecentOrders(status);
  const query = search.trim().toLowerCase();

  const orders =
    data?.filter((order) => {
      if (!query) return true;
      return (
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query)
      );
    }) ?? [];

  return (
    <Card id="orders" className="border-border/70 shadow-none scroll-mt-20">
      <CardHeader>
        <CardTitle>Recent orders</CardTitle>
        <CardDescription>
          Latest checkout activity from the mock commerce feed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-muted-foreground">
            Unable to load orders.
          </p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No orders match the current filters.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="hidden text-right md:table-cell">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{order.customer}</span>
                      <span className="text-xs text-muted-foreground">
                        {order.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[order.status]} className="capitalize">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${order.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="hidden text-right text-muted-foreground md:table-cell">
                    {format(parseISO(order.createdAt), "MMM d, HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
