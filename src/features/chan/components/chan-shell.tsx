"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";

type ChanShellProps = {
  children: React.ReactNode;
  boardSlug?: string;
  title?: string;
};

export function ChanShell({ children, boardSlug, title }: ChanShellProps) {
  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top,oklch(0.96_0.02_95),transparent_35%),linear-gradient(180deg,var(--background),oklch(0.97_0.01_140))] dark:bg-[radial-gradient(circle_at_top,oklch(0.28_0.03_95),transparent_35%),linear-gradient(180deg,var(--background),oklch(0.16_0.01_140))]">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/chan" className="text-sm font-semibold tracking-tight">
              Funlife Chan
            </Link>
            {boardSlug ? (
              <>
                <span className="text-muted-foreground">/</span>
                <Link
                  href={`/chan/${boardSlug}`}
                  className="truncate text-sm text-muted-foreground hover:text-foreground"
                >
                  {boardSlug}
                </Link>
              </>
            ) : null}
            {title ? (
              <span className="hidden truncate text-sm text-muted-foreground sm:inline">
                · {title}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
            >
              Dashboard
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
