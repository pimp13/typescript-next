"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ssoConfig, isAllowedIdpReturnTo } from "@/features/sso/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function IdpLoginForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("return_to");
  const error = searchParams.get("error");
  const allowedReturnTo = useMemo(
    () => (isAllowedIdpReturnTo(returnTo) ? returnTo : null),
    [returnTo],
  );

  const errorRedirect = useMemo(() => {
    const url = new URL(`${ssoConfig.appUrl}${ssoConfig.idpLoginPath}`);
    if (allowedReturnTo) {
      url.searchParams.set("return_to", allowedReturnTo);
    }
    return url.toString();
  }, [allowedReturnTo]);

  return (
    <Card className="w-full max-w-md border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Continue with Funlife SSO</CardTitle>
        <CardDescription>
          Sign in to the identity provider to authorize this application.
        </CardDescription>
      </CardHeader>
      <form
        method="POST"
        action={`${ssoConfig.idpUrl}/api/auth/browser-login`}
      >
        <CardContent className="grid gap-4">
          {!allowedReturnTo ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              This page must be opened from an SSO authorize redirect.
            </p>
          ) : null}
          {error ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <input type="hidden" name="return_to" value={allowedReturnTo ?? ""} />
          <input type="hidden" name="error_redirect" value={errorRedirect} />
          <div className="grid gap-2">
            <Label htmlFor="idp-email">Email</Label>
            <Input
              id="idp-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="idp-password">Password</Label>
            <Input
              id="idp-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={!allowedReturnTo}>
            Authorize application
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Looking for local login?{" "}
            <Link
              href="/login"
              className="text-foreground underline-offset-4 hover:underline"
            >
              Sign in with password
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
