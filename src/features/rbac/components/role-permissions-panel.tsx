"use client";

import { useEffect, useMemo, useState } from "react";
import { SaveIcon, ShieldCheckIcon } from "lucide-react";
import {
  useRbacPermissions,
  useRbacRoles,
  useSetRolePermissions,
} from "@/features/rbac/hooks/use-rbac";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export function RolePermissionsPanel() {
  const rolesQuery = useRbacRoles();
  const permissionsQuery = useRbacPermissions();
  const updateMutation = useSetRolePermissions();

  const roles = rolesQuery.data ?? [];
  const permissions = permissionsQuery.data ?? [];

  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());
  const [initialCodes, setInitialCodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (roles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

  useEffect(() => {
    if (!selectedRoleId) return;
    const role = roles.find((item) => item.id === selectedRoleId);
    if (!role) return;
    const codes = new Set((role.permissions ?? []).map((p) => p.code));
    setSelectedCodes(new Set(codes));
    setInitialCodes(new Set(codes));
  }, [roles, selectedRoleId]);

  const grouped = useMemo(() => {
    return permissions.reduce<Record<string, typeof permissions>>(
      (acc, permission) => {
        const key = permission.resource || "other";
        if (!acc[key]) acc[key] = [];
        acc[key].push(permission);
        return acc;
      },
      {},
    );
  }, [permissions]);

  const hasChanges =
    selectedCodes.size !== initialCodes.size ||
    [...selectedCodes].some((code) => !initialCodes.has(code));

  const toggleCode = (code: string) => {
    setSelectedCodes((current) => {
      const next = new Set(current);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const toggleResource = (resource: string) => {
    const resourcePermissions = grouped[resource] ?? [];
    const allSelected = resourcePermissions.every((p) =>
      selectedCodes.has(p.code),
    );
    setSelectedCodes((current) => {
      const next = new Set(current);
      for (const permission of resourcePermissions) {
        if (allSelected) next.delete(permission.code);
        else next.add(permission.code);
      }
      return next;
    });
  };

  if (rolesQuery.isLoading || permissionsQuery.isLoading) {
    return <Skeleton className="h-96 w-full rounded-2xl" />;
  }

  if (!roles.length) {
    return (
      <p className="rounded-2xl border border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
        Create a role first, then assign permissions.
      </p>
    );
  }

  const selectedRole = roles.find((role) => role.id === selectedRoleId);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="size-5" />
            <h3 className="text-base font-semibold tracking-tight">
              Role access
            </h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose which permissions this role is allowed to use.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            value={selectedRoleId}
            onValueChange={(value) => {
              if (value) setSelectedRoleId(value);
            }}
          >
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            disabled={
              !hasChanges ||
              selectedCodes.size === 0 ||
              updateMutation.isPending ||
              !selectedRoleId
            }
            onClick={() => {
              updateMutation.mutate(
                {
                  roleId: selectedRoleId,
                  input: {
                    permission_codes: [...selectedCodes],
                    action: "replace",
                  },
                },
                {
                  onSuccess: () => {
                    setInitialCodes(new Set(selectedCodes));
                  },
                },
              );
            }}
          >
            <SaveIcon className="size-4" />
            {updateMutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/30 px-4 py-3">
        <div>
          <p className="text-sm font-medium">{selectedRole?.name}</p>
          <p className="text-xs text-muted-foreground">
            Permissions assigned to this role
          </p>
        </div>
        <Badge variant="secondary">{selectedCodes.size} selected</Badge>
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([resource, resourcePermissions]) => {
          const allSelected = resourcePermissions.every((p) =>
            selectedCodes.has(p.code),
          );
          const someSelected = resourcePermissions.some((p) =>
            selectedCodes.has(p.code),
          );

          return (
            <div
              key={resource}
              className="overflow-hidden rounded-2xl border border-border/70"
            >
              <div className="flex items-center justify-between border-b border-border/70 bg-muted/30 px-4 py-3">
                <div>
                  <p className="font-medium capitalize">{resource}</p>
                  <p className="text-xs text-muted-foreground">
                    Manage {resource} access
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {
                      resourcePermissions.filter((p) =>
                        selectedCodes.has(p.code),
                      ).length
                    }
                    /{resourcePermissions.length}
                  </span>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={!allSelected && someSelected}
                    onCheckedChange={() => toggleResource(resource)}
                    aria-label={`Toggle all ${resource} permissions`}
                  />
                </div>
              </div>

              <div className="grid gap-1 p-2 sm:grid-cols-2 lg:grid-cols-3">
                {resourcePermissions.map((permission) => (
                  <label
                    key={permission.id}
                    className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-3 hover:bg-muted/40"
                  >
                    <Checkbox
                      checked={selectedCodes.has(permission.code)}
                      onCheckedChange={() => toggleCode(permission.code)}
                      className="mt-0.5"
                    />
                    <span>
                      <span className="block text-sm font-medium capitalize">
                        {permission.action}
                      </span>
                      <span className="block font-mono text-xs text-muted-foreground">
                        {permission.code}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
