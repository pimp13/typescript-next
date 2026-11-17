"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { ApiError } from "@/lib/api";
import { hasPermission } from "@/features/auth/types";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "@/features/users/hooks/use-users";
import type {
  CreateUserFormValues,
  UpdateUserFormValues,
  UsersFiltersValues,
} from "@/features/users/schemas";
import type { ManagedUser } from "@/features/users/types";
import { DeleteUserDialog } from "@/features/users/components/delete-user-dialog";
import { UserFormDialog } from "@/features/users/components/user-form-dialog";
import { UsersFilters } from "@/features/users/components/users-filters";
import { UsersTable } from "@/features/users/components/users-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const initialFilters: UsersFiltersValues = {
  search: "",
  role: "ALL",
};

export function UsersManagement() {
  const router = useRouter();
  const {
    data: currentUser,
    isLoading: isAuthLoading,
    isError,
    error,
  } = useCurrentUser();

  const [filters, setFilters] = useState<UsersFiltersValues>(initialFilters);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const canRead = hasPermission(currentUser, "users:read");
  const canCreate = hasPermission(currentUser, "users:create");
  const canUpdate = hasPermission(currentUser, "users:update");
  const canDelete = hasPermission(currentUser, "users:delete");

  const listParams = useMemo(
    () => ({
      search: filters.search,
      role: filters.role === "ALL" ? undefined : filters.role,
    }),
    [filters],
  );

  const usersQuery = useUsers(listParams);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const onFiltersChange = useCallback((next: UsersFiltersValues) => {
    setFilters((prev) => {
      if (prev.search === next.search && prev.role === next.role) {
        return prev;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (isError && error instanceof ApiError && error.status === 401) {
      router.replace("/login");
    }
  }, [error, isError, router]);

  useEffect(() => {
    if (!isAuthLoading && currentUser && !canRead) {
      router.replace("/dashboard");
    }
  }, [canRead, currentUser, isAuthLoading, router]);

  if (isAuthLoading || !currentUser) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (!canRead) {
    return null;
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
          <p className="text-sm text-muted-foreground">
            Create, update, and remove accounts through the Go users API.
          </p>
        </div>
        {canCreate ? (
          <Button
            type="button"
            onClick={() => {
              setFormMode("create");
              setSelectedUser(null);
              setFormOpen(true);
            }}
          >
            <PlusIcon data-icon="inline-start" />
            Add user
          </Button>
        ) : null}
      </div>

      <UsersFilters values={filters} onChange={onFiltersChange} />

      <UsersTable
        users={usersQuery.data ?? []}
        currentUserId={currentUser.id}
        isLoading={usersQuery.isLoading}
        isError={usersQuery.isError}
        onEdit={(user) => {
          if (!canUpdate) return;
          setSelectedUser(user);
          setFormMode("edit");
          setFormOpen(true);
        }}
        onDelete={(user) => {
          if (!canDelete) return;
          setSelectedUser(user);
          setDeleteOpen(true);
        }}
      />

      <UserFormDialog
        open={formOpen}
        mode={formMode}
        user={selectedUser}
        pending={createMutation.isPending || updateMutation.isPending}
        onOpenChange={setFormOpen}
        onSubmitCreate={(values: CreateUserFormValues) => {
          createMutation.mutate(values, {
            onSuccess: () => setFormOpen(false),
          });
        }}
        onSubmitUpdate={(values: UpdateUserFormValues) => {
          if (!selectedUser) return;
          updateMutation.mutate(
            {
              id: selectedUser.id,
              input: {
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                role_slug: values.role_slug,
                status: values.status,
                ...(values.password ? { password: values.password } : {}),
              },
            },
            { onSuccess: () => setFormOpen(false) },
          );
        }}
      />

      <DeleteUserDialog
        user={selectedUser}
        open={deleteOpen}
        pending={deleteMutation.isPending}
        onOpenChange={setDeleteOpen}
        onConfirm={() => {
          if (!selectedUser) return;
          deleteMutation.mutate(selectedUser.id, {
            onSuccess: () => {
              setDeleteOpen(false);
              setSelectedUser(null);
            },
          });
        }}
      />
    </div>
  );
}
