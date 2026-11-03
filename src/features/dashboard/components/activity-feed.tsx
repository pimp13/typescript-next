"use client";

import type { ComponentType } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  CreditCardIcon,
  PackageIcon,
  ShieldIcon,
  UserPlusIcon,
} from "lucide-react";
import { useActivityFeed } from "@/features/dashboard/hooks/use-dashboard";
import type { ActivityItem } from "@/types/dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const iconByType: Record<
  ActivityItem["type"],
  ComponentType<{ className?: string }>
> = {
  order: PackageIcon,
  user: UserPlusIcon,
  billing: CreditCardIcon,
  system: ShieldIcon,
};

export function ActivityFeed() {
  const { data, isLoading, isError } = useActivityFeed();

  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Live-looking feed powered by mock events.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="grid flex-1 gap-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))
        ) : isError || !data ? (
          <p className="text-sm text-muted-foreground">
            Unable to load activity.
          </p>
        ) : (
          data.map((item) => {
            const Icon = iconByType[item.type];
            return (
              <div key={item.id} className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium">{item.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDistanceToNow(parseISO(item.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
