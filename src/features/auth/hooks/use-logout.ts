"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";
import { logout } from "@/features/auth/api";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: async () => {
      queryClient.setQueryData(queryKeys.auth.me, null);
      queryClient.removeQueries({ queryKey: queryKeys.dashboard.all });
      toast.success("Logged out");
      router.replace("/login");
      router.refresh();
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Logout failed";
      toast.error(message);
    },
  });
}
