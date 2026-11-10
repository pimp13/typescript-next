"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";
import { getMe } from "@/features/auth/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SsoComplete() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    void (async () => {
      try {
        const response = await getMe();
        queryClient.setQueryData(queryKeys.auth.me, response.data ?? null);
        toast.success("Signed in with SSO");
        router.replace("/dashboard");
        router.refresh();
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : "SSO session not found";
        toast.error(message);
        router.replace("/login");
      }
    })();
  }, [queryClient, router]);

  return (
    <Card className="w-full max-w-md border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Finishing SSO sign-in</CardTitle>
        <CardDescription>
          Confirming your session with the API…
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          You will be redirected automatically.
        </p>
      </CardContent>
    </Card>
  );
}
