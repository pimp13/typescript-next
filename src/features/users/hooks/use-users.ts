"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from "@/features/users/api";
import type {
  CreateUserInput,
  ListUsersParams,
  UpdateUserInput,
} from "@/features/users/types";

export function useUsers(params: ListUsersParams) {
  return useQuery({
    queryKey: queryKeys.users.list({
      search: params.search ?? "",
      role: params.role ?? "ALL",
    }),
    queryFn: async () => {
      const response = await listUsers(params);
      return response.data ?? [];
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("User created");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to create user",
      );
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
      updateUser(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      toast.success("User updated");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to update user",
      );
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("User deleted");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to delete user",
      );
    },
  });
}
