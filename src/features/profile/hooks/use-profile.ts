"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";
import {
  changePassword,
  getPublicProfile,
  updateProfile,
} from "@/features/profile/api";
import type {
  ChangePasswordInput,
  UpdateProfileInput,
} from "@/features/profile/types";

export function usePublicProfile(handle: string) {
  return useQuery({
    queryKey: queryKeys.profile.public(handle),
    queryFn: async () => {
      const profile = await getPublicProfile(handle);
      if (!profile) throw new ApiError("Profile not found", 404);
      return profile;
    },
    enabled: Boolean(handle),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) return false;
      return failureCount < 1;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input),
    onSuccess: async (response) => {
      queryClient.setQueryData(queryKeys.auth.me, response.data ?? null);
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      toast.success("Profile updated");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to update profile",
      );
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ChangePasswordInput) => changePassword(input),
    onSuccess: async (response) => {
      if (response.data) {
        queryClient.setQueryData(queryKeys.auth.me, response.data);
      }
      toast.success("Password changed");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Failed to change password",
      );
    },
  });
}
