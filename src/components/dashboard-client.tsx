"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { getMe, logout, type User } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const response = await getMe();
        if (!cancelled) {
          setUser(response.data ?? null);
        }
      } catch (error) {
        if (!cancelled) {
          if (error instanceof ApiError && error.status === 401) {
            router.replace("/login");
            return;
          }
          toast.error("Failed to load session");
          router.replace("/login");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function onLogout() {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Logout failed";
      toast.error(message);
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Loading session...</CardTitle>
          <CardDescription>Checking your JWT cookie with the API.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Welcome, {user.name}</CardTitle>
        <CardDescription>
          Authenticated against the Fastify backend via cookie JWT.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-1 rounded-lg border p-3 text-sm">
          <p>
            <span className="text-muted-foreground">Email:</span> {user.email}
          </p>
          <p>
            <span className="text-muted-foreground">User ID:</span> {user.id}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onLogout} disabled={loggingOut} variant="outline">
            {loggingOut ? "Signing out..." : "Sign out"}
          </Button>
          <Button variant="secondary" render={<Link href="/" />}>
            Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
