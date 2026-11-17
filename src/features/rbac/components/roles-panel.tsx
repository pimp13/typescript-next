"use client";

import { useMemo, useState } from "react";
import {
  KeyRoundIcon,
  MoreHorizontalIcon,
  SearchIcon,
  ShieldIcon,
  Trash2Icon,
} from "lucide-react";
import {
  useDeleteRole,
  useRbacRoles,
} from "@/features/rbac/hooks/use-rbac";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function RolesPanel() {
  const [search, setSearch] = useState("");
  const rolesQuery = useRbacRoles();
  const deleteMutation = useDeleteRole();

  const roles = rolesQuery.data ?? [];
  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return roles;
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(value) ||
        role.slug.toLowerCase().includes(value) ||
        role.description?.toLowerCase().includes(value),
    );
  }, [roles, search]);

  if (rolesQuery.isLoading) {
    return <Skeleton className="h-72 w-full rounded-2xl" />;
  }

  if (rolesQuery.isError) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-8 text-center text-sm text-destructive">
        Failed to load roles. You need the <code>roles:manage</code> permission.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight">All roles</h3>
          <p className="text-sm text-muted-foreground">
            System roles are protected and cannot be deleted.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search roles..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-28 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ShieldIcon className="size-7" />
                    <p className="text-sm font-medium text-foreground">
                      No roles found
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-muted/40">
                        <ShieldIcon className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{role.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {role.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs text-muted-foreground">
                      {role.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <KeyRoundIcon className="size-3" />
                      {role.permissions?.length ?? 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.is_system ? "secondary" : "outline"}>
                      {role.is_system ? "System" : "Custom"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            aria-label="Role actions"
                          />
                        }
                      >
                        <MoreHorizontalIcon className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          disabled={
                            role.is_system || deleteMutation.isPending
                          }
                          variant="destructive"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete role “${role.name}”? This cannot be undone.`,
                              )
                            ) {
                              deleteMutation.mutate(role.id);
                            }
                          }}
                        >
                          <Trash2Icon className="size-4" />
                          Delete role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {roles.length} roles
      </p>
    </div>
  );
}
