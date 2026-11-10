import { Suspense } from "react";
import { IdpLoginForm } from "@/features/sso/components/idp-login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function IdpLoginFallback() {
  return (
    <Card className="w-full max-w-md border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Continue with Funlife SSO</CardTitle>
        <CardDescription>Loading identity provider login…</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Please wait.</p>
      </CardContent>
    </Card>
  );
}

export default function SsoIdpLoginPage() {
  return (
    <Suspense fallback={<IdpLoginFallback />}>
      <IdpLoginForm />
    </Suspense>
  );
}
