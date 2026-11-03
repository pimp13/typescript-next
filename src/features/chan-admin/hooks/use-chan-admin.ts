"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";
import {
  createAdminBan,
  createAdminBoard,
  deactivateAdminBan,
  deleteAdminBoard,
  deleteAdminPost,
  deleteAdminThread,
  getChanAdminStats,
  listAdminBans,
  listAdminBoards,
  listAdminPosts,
  listAdminThreads,
  updateAdminBoard,
  updateAdminThread,
} from "@/features/chan-admin/api";

function onError(error: unknown, fallback: string) {
  toast.error(error instanceof ApiError ? error.message : fallback);
}

export function useChanAdminStats() {
  return useQuery({
    queryKey: queryKeys.chanAdmin.stats,
    queryFn: async () => (await getChanAdminStats()).data!,
  });
}

export function useAdminBoards() {
  return useQuery({
    queryKey: queryKeys.chanAdmin.boards,
    queryFn: async () => (await listAdminBoards()).data ?? [],
  });
}

export function useAdminThreads() {
  return useQuery({
    queryKey: queryKeys.chanAdmin.threads,
    queryFn: async () => (await listAdminThreads()).data ?? [],
  });
}

export function useAdminPosts() {
  return useQuery({
    queryKey: queryKeys.chanAdmin.posts,
    queryFn: async () => (await listAdminPosts()).data ?? [],
  });
}

export function useAdminBans() {
  return useQuery({
    queryKey: queryKeys.chanAdmin.bans,
    queryFn: async () => (await listAdminBans()).data ?? [],
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminBoard,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.chanAdmin.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.chan.boards });
      toast.success("Board created");
    },
    onError: (error) => onError(error, "Failed to create board"),
  });
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      updateAdminBoard(id, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.chanAdmin.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.chan.all });
      toast.success("Board updated");
    },
    onError: (error) => onError(error, "Failed to update board"),
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminBoard,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.chanAdmin.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.chan.all });
      toast.success("Board deleted");
    },
    onError: (error) => onError(error, "Failed to delete board"),
  });
}

export function useModerateThread() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: { isSticky?: boolean; isLocked?: boolean };
    }) => updateAdminThread(id, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.chanAdmin.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.chan.all });
      toast.success("Thread updated");
    },
    onError: (error) => onError(error, "Failed to update thread"),
  });
}

export function useDeleteThreadAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminThread,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.chanAdmin.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.chan.all });
      toast.success("Thread deleted");
    },
    onError: (error) => onError(error, "Failed to delete thread"),
  });
}

export function useDeletePostAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminPost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.chanAdmin.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.chan.all });
      toast.success("Post deleted");
    },
    onError: (error) => onError(error, "Failed to delete post"),
  });
}

export function useCreateBan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminBan,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.chanAdmin.bans });
      toast.success("Ban created");
    },
    onError: (error) => onError(error, "Failed to create ban"),
  });
}

export function useDeactivateBan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateAdminBan,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.chanAdmin.bans });
      toast.success("Ban deactivated");
    },
    onError: (error) => onError(error, "Failed to deactivate ban"),
  });
}
