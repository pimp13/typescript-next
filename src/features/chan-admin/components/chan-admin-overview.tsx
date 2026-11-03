"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutGridIcon,
  MessageSquareIcon,
  ShieldBanIcon,
  SquareStackIcon,
} from "lucide-react";
import { ApiError } from "@/lib/api";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useChanAdminStats } from "@/features/chan-admin/hooks/use-chan-admin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const adminRoles = new Set(["SUPER_ADMIN", "ADMIN_GENERAL"]);

export function ChanAdminOverview() {
  const router = useRouter();
  const { data: user, isLoading: authLoading, isError, error } = useCurrentUser();
  const statsQuery = useChanAdminStats();

  useEffect(() => {
    if (isError && error instanceof ApiError && error.status === 401) {
      router.replace("/login");
    }
  }, [error, isError, router]);

  useEffect(() => {
    if (!authLoading && user && !adminRoles.has(user.role)) {
      router.replace("/dashboard");
    }
  }, [authLoading, router, user]);

  if (authLoading || !user || !adminRoles.has(user.role)) {
    return <Skeleton className="h-64 w-full rounded-2xl" />;
  }

  const stats = statsQuery.data;

  return (
    <div className="grid gap-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Chan control</h2>
        <p className="text-sm text-muted-foreground">
          Manage boards, moderate threads/posts, and issue bans for the imageboard.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Boards",
            value: stats?.boards ?? "—",
            icon: LayoutGridIcon,
          },
          {
            label: "Threads",
            value: stats?.threads ?? "—",
            icon: SquareStackIcon,
          },
          {
            label: "Posts",
            value: stats?.posts ?? "—",
            icon: MessageSquareIcon,
          },
          {
            label: "Active bans",
            value: stats?.activeBans ?? "—",
            icon: ShieldBanIcon,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="border-border/70 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>{item.label}</CardDescription>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-3xl tabular-nums">{item.value}</CardTitle>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/70 shadow-none">
          <CardHeader>
            <CardTitle>Boards</CardTitle>
            <CardDescription>Create and configure public boards.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link href="/dashboard/chan/boards" />}>
              Manage boards
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border/70 shadow-none">
          <CardHeader>
            <CardTitle>Moderation</CardTitle>
            <CardDescription>
              Sticky, lock, delete, and ban across the site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              render={<Link href="/dashboard/chan/moderation" />}
            >
              Open moderation
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 shadow-none">
        <CardHeader>
          <CardTitle>Public board</CardTitle>
          <CardDescription>Jump to the live imageboard experience.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" render={<Link href="/chan" />}>
            Open /chan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
