"use client";

import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";

const pageMeta: Record<string, { title: string; description?: string }> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Operational overview with mock commerce data",
  },
  "/dashboard/users": {
    title: "User management",
    description: "Super admin controls for every account",
  },
  "/dashboard/monitoring": {
    title: "Monitoring",
    description: "Live system telemetry for super admins",
  },
  "/dashboard/chan": {
    title: "Chan admin",
    description: "Imageboard operations overview",
  },
  "/dashboard/chan/boards": {
    title: "Boards",
    description: "Create and configure public boards",
  },
  "/dashboard/chan/moderation": {
    title: "Moderation",
    description: "Threads, posts, and bans",
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const meta = pageMeta[pathname] ?? {
    title: "Dashboard",
    description: "Funlife workspace",
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <SiteHeader title={meta.title} description={meta.description} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-[radial-gradient(circle_at_top,oklch(0.96_0.02_95),transparent_35%),linear-gradient(180deg,var(--background),oklch(0.97_0.01_140))] dark:bg-[radial-gradient(circle_at_top,oklch(0.28_0.03_95),transparent_35%),linear-gradient(180deg,var(--background),oklch(0.16_0.01_140))]">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
