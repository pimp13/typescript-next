import Link from "next/link";
import { LifeBuoyIcon } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-[radial-gradient(circle_at_top_left,oklch(0.96_0.03_95),transparent_38%),linear-gradient(180deg,var(--background),oklch(0.97_0.01_160))] dark:bg-[radial-gradient(circle_at_top_left,oklch(0.28_0.04_95),transparent_40%),linear-gradient(180deg,var(--background),oklch(0.16_0.02_160))]">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg outline-none ring-ring focus-visible:ring-2"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
              <LifeBuoyIcon className="size-4" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-sm font-semibold tracking-tight">
                Funlife
              </span>
              <span className="text-[11px] text-muted-foreground">Profile</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/articles"
              className="rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              Stories
            </Link>
            <Link
              href="/dashboard"
              className="hidden rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground sm:inline"
            >
              Dashboard
            </Link>
            <ThemeToggle />
            <UserMenu />
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
