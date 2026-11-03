"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";
import {
  createReply,
  createThread,
  getThread,
  listBoards,
  listThreads,
} from "@/features/chan/api";

export function useBoards() {
  return useQuery({
    queryKey: queryKeys.chan.boards,
    queryFn: async () => {
      const response = await listBoards();
      return response.data ?? [];
    },
  });
}

export function useBoardThreads(
  slug: string,
  params: { mode: "list" | "catalog"; page: number },
) {
  return useQuery({
    queryKey: queryKeys.chan.threads(slug, params),
    queryFn: async () => {
      const response = await listThreads(slug, params);
      return response.data!;
    },
    enabled: Boolean(slug),
  });
}

export function useThread(slug: string, threadId: string) {
  return useQuery({
    queryKey: queryKeys.chan.thread(slug, threadId),
    queryFn: async () => {
      const response = await getThread(slug, threadId);
      return response.data!;
    },
    enabled: Boolean(slug && threadId),
  });
}

export function useCreateThread(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createThread(slug, formData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.chan.all });
      toast.success("Thread created");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to create thread",
      );
    },
  });
}

export function useCreateReply(slug: string, threadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createReply(slug, threadId, formData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.chan.thread(slug, threadId),
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.chan.all });
      toast.success("Reply posted");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to post reply",
      );
    },
  });
}
