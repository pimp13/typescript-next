"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ActivityIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  MessageSquareIcon,
  SettingsIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function AppSidebar() {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const isAdmin =
    user?.role === "SUPER_ADMIN" || user?.role === "ADMIN_GENERAL";

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboardIcon },
    { href: "/chan", label: "Open Chan", icon: MessageSquareIcon },
    ...(isAdmin
      ? [
          { href: "/dashboard/chan", label: "Chan admin", icon: ShieldIcon },
          {
            href: "/dashboard/chan/boards",
            label: "Boards",
            icon: SettingsIcon,
          },
          {
            href: "/dashboard/chan/moderation",
            label: "Moderation",
            icon: ShieldIcon,
          },
        ]
      : []),
    ...(isSuperAdmin
      ? [
          { href: "/dashboard/users", label: "Users", icon: UsersIcon },
          {
            href: "/dashboard/monitoring",
            label: "Monitoring",
            icon: ActivityIcon,
          },
        ]
      : []),
  ];

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="gap-3 px-3 py-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 rounded-lg px-1 outline-none ring-sidebar-ring focus-visible:ring-2"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <LifeBuoyIcon className="size-4" />
          </span>
          <span className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight">Funlife</span>
            <span className="text-xs text-muted-foreground">Chan + Ops</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.href ||
                      (item.href !== "/chan" &&
                        pathname.startsWith(`${item.href}/`));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      render={<Link href={item.href} />}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-3">
        <div className="flex items-center justify-between rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
          <span className="px-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            Appearance
          </span>
          <ThemeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
