"use client";

import { format, parseISO } from "date-fns";
import {
  formatRoleLabel,
} from "@/features/monitoring/lib/format";
import type { MonitoringSnapshot } from "@/features/monitoring/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type UsersPanelProps = {
  users: MonitoringSnapshot["users"];
};

export function UsersPanel({ users }: UsersPanelProps) {
  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle>User pulse</CardTitle>
        <CardDescription>
          {users.active} active · {users.inactive} inactive · {users.total} total
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="flex flex-wrap gap-2">
          {users.byRole.map((item) => (
            <Badge key={item.role} variant="secondary" className="gap-2 px-3 py-1">
              <span>{formatRoleLabel(item.role)}</span>
              <span className="tabular-nums text-foreground">{item.count}</span>
            </Badge>
          ))}
        </div>

        <div className="grid gap-3">
          {users.recentLogins.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent logins yet.</p>
          ) : (
            users.recentLogins.map((user) => (
              <div
                key={user.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/15 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <Badge variant="outline" className="mb-1">
                    {formatRoleLabel(user.role)}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {user.lastLogin
                      ? format(parseISO(user.lastLogin), "MMM d, HH:mm")
                      : "—"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
