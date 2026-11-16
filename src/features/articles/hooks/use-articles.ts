"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";
import {
  createArticle,
  deleteArticle,
  listArticles,
  updateArticle,
} from "@/features/articles/api";
import type {
  CreateArticleInput,
  ListArticlesParams,
  UpdateArticleInput,
} from "@/features/articles/types";

export function useArticles(params: ListArticlesParams) {
  return useQuery({
    queryKey: queryKeys.articles.list({
      search: params.search ?? "",
      status: params.status ?? "all",
    }),
    queryFn: async () => {
      const response = await listArticles(params);
      return response.data ?? [];
    },
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateArticleInput) => createArticle(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
      toast.success("Article created");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to create article",
      );
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateArticleInput }) =>
      updateArticle(id, input),
    onSuccess: async (_response, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.articles.detail(variables.id),
      });
      toast.success("Article updated");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to update article",
      );
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
      toast.success("Article deleted");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to delete article",
      );
    },
  });
}
