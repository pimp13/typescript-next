"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";
import { register } from "@/features/auth/api";
import type { RegisterFormValues } from "@/features/auth/schemas";

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: RegisterFormValues) => register(values),
    onSuccess: async (response) => {
      queryClient.setQueryData(queryKeys.auth.me, response.data ?? null);
      toast.success("Account created successfully");
      router.push("/dashboard");
      router.refresh();
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Registration failed";
      toast.error(message);
    },
  });
}
