"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";

type SiteHeaderProps = {
  title: string;
  description?: string;
};

export function SiteHeader({ title, description }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border/70 bg-background/80 px-4 backdrop-blur-md md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 hidden h-5 sm:block" />
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold tracking-tight md:text-base">
          {title}
        </h1>
        {description ? (
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {description}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-1">
        <div className="md:hidden">
          <ThemeToggle />
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
