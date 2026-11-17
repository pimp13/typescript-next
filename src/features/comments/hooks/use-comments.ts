"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";
import {
  createPublicComment,
  deleteComment,
  listComments,
  listPublicComments,
  updateComment,
} from "@/features/comments/api";
import type {
  CreatePublicCommentInput,
  ListCommentsParams,
  UpdateCommentInput,
} from "@/features/comments/types";

export function usePublicComments(slug: string) {
  return useQuery({
    queryKey: queryKeys.comments.public(slug),
    queryFn: async () => {
      const response = await listPublicComments(slug);
      return response.data ?? [];
    },
    enabled: Boolean(slug),
  });
}

export function useCreatePublicComment(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePublicCommentInput) =>
      createPublicComment(slug, input),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.comments.public(slug),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.comments.all,
      });
      if (response.data?.status === "pending") {
        toast.success("Comment submitted for review");
      } else {
        toast.success("Comment posted");
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to post comment",
      );
    },
  });
}

export function useAdminComments(params: ListCommentsParams) {
  return useQuery({
    queryKey: queryKeys.comments.list({
      search: params.search ?? "",
      status: params.status ?? "all",
    }),
    queryFn: async () => {
      const response = await listComments(params);
      return response.data ?? [];
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCommentInput }) =>
      updateComment(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.comments.all });
      toast.success("Comment updated");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to update comment",
      );
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.comments.all });
      toast.success("Comment deleted");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to delete comment",
      );
    },
  });
}
