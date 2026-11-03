"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";
import { login } from "@/features/auth/api";
import type { LoginFormValues } from "@/features/auth/schemas";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: LoginFormValues) => login(values),
    onSuccess: async (response) => {
      queryClient.setQueryData(queryKeys.auth.me, response.data ?? null);
      toast.success("Logged in successfully");
      router.push("/dashboard");
      router.refresh();
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Login failed";
      toast.error(message);
    },
  });
}
