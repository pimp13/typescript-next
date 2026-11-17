"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";
import {
  createPermission,
  createRole,
  deleteRole,
  listGoUsers,
  listPermissions,
  listRoles,
  setRolePermissions,
  setRoleToUser,
} from "@/features/rbac/api";
import type {
  CreatePermissionInput,
  CreateRoleInput,
  SetRolePermissionsInput,
  SetRoleToUserInput,
} from "@/features/rbac/types";

export function useRbacPermissions() {
  return useQuery({
    queryKey: queryKeys.rbac.permissions,
    queryFn: listPermissions,
  });
}

export function useRbacRoles() {
  return useQuery({
    queryKey: queryKeys.rbac.roles,
    queryFn: listRoles,
  });
}

export function useRbacUsers() {
  return useQuery({
    queryKey: queryKeys.rbac.users,
    queryFn: listGoUsers,
  });
}

export function useCreatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePermissionInput) => createPermission(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.rbac.all });
      toast.success("Permission created");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Failed to create permission",
      );
    },
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRoleInput) => createRole(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.rbac.all });
      toast.success("Role created");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to create role",
      );
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.rbac.all });
      toast.success("Role deleted");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to delete role",
      );
    },
  });
}

export function useSetRolePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roleId,
      input,
    }: {
      roleId: string;
      input: SetRolePermissionsInput;
    }) => setRolePermissions(roleId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.rbac.all });
      toast.success("Role permissions updated");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Failed to update role permissions",
      );
    },
  });
}

export function useAssignRoleToUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roleId,
      input,
    }: {
      roleId: string;
      input: SetRoleToUserInput;
    }) => setRoleToUser(roleId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.rbac.all });
      toast.success("User role updated");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Failed to update user role",
      );
    },
  });
}
