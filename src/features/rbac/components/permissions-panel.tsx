"use client";

import { useMemo, useState } from "react";
import { KeyRoundIcon, SearchIcon } from "lucide-react";
import { useRbacPermissions } from "@/features/rbac/hooks/use-rbac";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function PermissionsPanel() {
  const [search, setSearch] = useState("");
  const permissionsQuery = useRbacPermissions();
  const permissions = permissionsQuery.data ?? [];

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return permissions;
    return permissions.filter(
      (permission) =>
        permission.code.toLowerCase().includes(value) ||
        permission.name.toLowerCase().includes(value) ||
        permission.resource.toLowerCase().includes(value) ||
        permission.action.toLowerCase().includes(value),
    );
  }, [permissions, search]);

  if (permissionsQuery.isLoading) {
    return <Skeleton className="h-72 w-full rounded-2xl" />;
  }

  if (permissionsQuery.isError) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-8 text-center text-sm text-destructive">
        Failed to load permissions.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight">
            Permission catalog
          </h3>
          <p className="text-sm text-muted-foreground">
            Fine-grained capabilities assigned to roles as{" "}
            <code className="text-xs">resource:action</code>.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search permissions..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Permission</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-28 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <KeyRoundIcon className="size-7" />
                    <p className="text-sm font-medium text-foreground">
                      No permissions found
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-muted/40">
                        <KeyRoundIcon className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{permission.name}</p>
                        <code className="text-xs text-muted-foreground">
                          {permission.code}
                        </code>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{permission.resource}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{permission.action}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs text-sm text-muted-foreground">
                    {permission.description || "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {permissions.length} permissions
      </p>
    </div>
  );
}
