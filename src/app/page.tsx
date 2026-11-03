import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function HomePage() {
  return (
    <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-6 py-16">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Funlife</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Commerce dashboard, ready to grow
        </h1>
        <p className="max-w-xl text-muted-foreground">
          TypeScript frontend with feature-based architecture, React Query,
          React Hook Form, shadcn/ui, and Fastify JWT auth.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button render={<Link href="/login" />}>Sign in</Button>
        <Button variant="outline" render={<Link href="/register" />}>
          Create account
        </Button>
        <Button variant="secondary" render={<Link href="/dashboard" />}>
          Open dashboard
        </Button>
      </div>
    </main>
  );
}
