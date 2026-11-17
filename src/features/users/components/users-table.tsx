"use client";

import { format, parseISO } from "date-fns";
import { PencilIcon, Trash2Icon } from "lucide-react";
import {
  userDisplayName,
  type ManagedUser,
} from "@/features/users/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type UsersTableProps = {
  users: ManagedUser[];
  currentUserId?: string;
  isLoading?: boolean;
  isError?: boolean;
  onEdit: (user: ManagedUser) => void;
  onDelete: (user: ManagedUser) => void;
};

function roleBadgeVariant(slug: string) {
  switch (slug) {
    case "super_admin":
      return "default" as const;
    case "admin":
    case "editor":
      return "outline" as const;
    default:
      return "secondary" as const;
  }
}

function formatMaybeDate(value?: string | null) {
  if (!value) return "Never";
  try {
    return format(parseISO(value), "MMM d, yyyy HH:mm");
  } catch {
    return "—";
  }
}

export function UsersTable({
  users,
  currentUserId,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 rounded-xl border border-border/70 p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 p-6 text-sm text-muted-foreground">
        Could not load users. You need the <code>users:read</code> permission on
        the Go API.
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-border/70 p-6 text-sm text-muted-foreground">
        No users match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/70">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Last Login</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            const name = userDisplayName(user);
            const slug = user.role?.slug ?? "user";

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {name}
                      {isSelf ? (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (you)
                        </span>
                      ) : null}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={roleBadgeVariant(slug)}>
                    {user.role?.name || slug}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  <Badge
                    variant={
                      user.status === "active"
                        ? "success"
                        : user.status === "banned"
                          ? "destructive"
                          : "warning"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {formatMaybeDate(user.last_login)}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {formatMaybeDate(user.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${name}`}
                      onClick={() => onEdit(user)}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${name}`}
                      disabled={isSelf}
                      onClick={() => onDelete(user)}
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
