"use client";

import { useMemo, useState } from "react";
import { SearchIcon, UserRoundIcon } from "lucide-react";
import {
  useAssignRoleToUser,
  useRbacRoles,
  useRbacUsers,
} from "@/features/rbac/hooks/use-rbac";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { SUPER_ADMIN_EMAIL } from "@/config/dashboard";

export function UserRolesPanel() {
  const [search, setSearch] = useState("");
  const [draftRoles, setDraftRoles] = useState<Record<string, string>>({});

  const usersQuery = useRbacUsers();
  const rolesQuery = useRbacRoles();
  const assignMutation = useAssignRoleToUser();

  const users = usersQuery.data ?? [];
  const roles = rolesQuery.data ?? [];

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return users;
    return users.filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      return (
        fullName.includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.username?.toLowerCase().includes(value) ||
        user.role?.name?.toLowerCase().includes(value) ||
        user.role?.slug?.toLowerCase().includes(value)
      );
    });
  }, [users, search]);

  if (usersQuery.isLoading || rolesQuery.isLoading) {
    return <Skeleton className="h-96 w-full rounded-2xl" />;
  }

  if (usersQuery.isError) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-8 text-center text-sm text-destructive">
        Failed to load users. You need the <code>users:read</code> permission.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight">User access</h3>
          <p className="text-sm text-muted-foreground">
            Assign a role to a specific user. Removing falls back to the default{" "}
            <code className="text-xs">user</code> role.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Current role</TableHead>
              <TableHead>Assign role</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-28 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <UserRoundIcon className="size-7" />
                    <p className="text-sm font-medium text-foreground">
                      No users found
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => {
                const currentRoleId = user.role?.id ?? "";
                const selectedRoleId = draftRoles[user.id] ?? currentRoleId;
                const changed =
                  Boolean(selectedRoleId) && selectedRoleId !== currentRoleId;

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {user.role?.name ?? user.role?.slug ?? "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        disabled={user.email === SUPER_ADMIN_EMAIL ? true : false}
                        value={selectedRoleId || undefined}
                        onValueChange={(value) => {
                          if (!value) return;
                          setDraftRoles((prev) => ({
                            ...prev,
                            [user.id]: value,
                          }));
                        }}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select role">
                            {(value: string | null) =>
                              roles.find((role) => role.id === value)?.name ??
                              user.role?.name ??
                              "Select role"
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          disabled={
                            !changed ||
                            assignMutation.isPending ||
                            !selectedRoleId
                          }
                          onClick={() => {
                            assignMutation.mutate(
                              {
                                roleId: selectedRoleId,
                                input: {
                                  user_id: user.id,
                                  action: "assign",
                                },
                              },
                              {
                                onSuccess: () => {
                                  setDraftRoles((prev) => {
                                    const next = { ...prev };
                                    delete next[user.id];
                                    return next;
                                  });
                                },
                              },
                            );
                          }}
                        >
                          Assign
                        </Button>
                        {currentRoleId ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={assignMutation.isPending}
                            onClick={() => {
                              assignMutation.mutate(
                                {
                                  roleId: currentRoleId,
                                  input: {
                                    user_id: user.id,
                                    action: "remove",
                                  },
                                },
                                {
                                  onSuccess: () => {
                                    setDraftRoles((prev) => {
                                      const next = { ...prev };
                                      delete next[user.id];
                                      return next;
                                    });
                                  },
                                },
                              );
                            }}
                          >
                            Reset
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
