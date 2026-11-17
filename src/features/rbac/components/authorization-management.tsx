"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  KeyRoundIcon,
  PlusIcon,
  ShieldCheckIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";
import { ApiError } from "@/lib/api";
import { hasPermission } from "@/features/auth/types";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { CreatePermissionForm } from "@/features/rbac/components/create-permission-form";
import { CreateRoleForm } from "@/features/rbac/components/create-role-form";
import { PermissionsPanel } from "@/features/rbac/components/permissions-panel";
import { RolePermissionsPanel } from "@/features/rbac/components/role-permissions-panel";
import { RolesPanel } from "@/features/rbac/components/roles-panel";
import { UserRolesPanel } from "@/features/rbac/components/user-roles-panel";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type ModalKind = "role" | "permission" | null;

export function AuthorizationManagement() {
  const router = useRouter();
  const {
    data: currentUser,
    isLoading: isAuthLoading,
    isError,
    error,
  } = useCurrentUser();
  const [modal, setModal] = useState<ModalKind>(null);
  const [tab, setTab] = useState("roles");

  const canManage = hasPermission(currentUser, "roles:manage");

  useEffect(() => {
    if (isError && error instanceof ApiError && error.status === 401) {
      router.replace("/login");
    }
  }, [error, isError, router]);

  useEffect(() => {
    if (!isAuthLoading && currentUser && !canManage) {
      router.replace("/dashboard");
    }
  }, [canManage, currentUser, isAuthLoading, router]);

  if (isAuthLoading || !currentUser) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-[28rem] w-full rounded-2xl" />
      </div>
    );
  }

  if (!canManage) {
    return null;
  }

  return (
    <>
      <div className="grid gap-6">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldIcon className="size-5" />
              <h2 className="text-2xl font-semibold tracking-tight">
                Authorization
              </h2>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Manage roles, permissions, and user access through the Go RBAC
              API.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setModal("permission")}>
              <PlusIcon className="size-4" />
              Create permission
            </Button>
            <Button onClick={() => setModal("role")}>
              <PlusIcon className="size-4" />
              Create role
            </Button>
          </div>
        </section>

        <Card className="border-border/70 shadow-sm">
          <CardContent className="pt-6">
            <Tabs
              value={tab}
              onValueChange={(value) => {
                if (typeof value === "string") setTab(value);
              }}
            >
              <TabsList className="grid h-auto w-full max-w-2xl grid-cols-2 gap-1 sm:grid-cols-4">
                <TabsTrigger value="roles">
                  <ShieldIcon className="size-4" />
                  Roles
                </TabsTrigger>
                <TabsTrigger value="permissions">
                  <KeyRoundIcon className="size-4" />
                  Permissions
                </TabsTrigger>
                <TabsTrigger value="role-access">
                  <ShieldCheckIcon className="size-4" />
                  Role access
                </TabsTrigger>
                <TabsTrigger value="user-access">
                  <UsersIcon className="size-4" />
                  User access
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="roles">
                  <RolesPanel />
                </TabsContent>
                <TabsContent value="permissions">
                  <PermissionsPanel />
                </TabsContent>
                <TabsContent value="role-access">
                  <RolePermissionsPanel />
                </TabsContent>
                <TabsContent value="user-access">
                  <UserRolesPanel />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <ResponsiveModal
        open={modal === "role"}
        onOpenChange={(open) => !open && setModal(null)}
        title="Create role"
        description="Define a new access profile that permissions can be attached to."
        size="md"
      >
        <CreateRoleForm onClose={() => setModal(null)} />
      </ResponsiveModal>

      <ResponsiveModal
        open={modal === "permission"}
        onOpenChange={(open) => !open && setModal(null)}
        title="Create permission"
        description="Add a fine-grained capability to the catalog."
        size="md"
      >
        <CreatePermissionForm onClose={() => setModal(null)} />
      </ResponsiveModal>
    </>
  );
}
