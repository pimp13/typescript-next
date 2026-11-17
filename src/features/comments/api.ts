import { goApiFetch } from "@/lib/api";
import type {
  ArticleComment,
  CreatePublicCommentInput,
  ListCommentsParams,
  UpdateCommentInput,
} from "@/features/comments/types";

function toQuery(params: ListCommentsParams) {
  const searchParams = new URLSearchParams();
  if (params.search?.trim()) searchParams.set("search", params.search.trim());
  if (params.article_id?.trim()) {
    searchParams.set("article_id", params.article_id.trim());
  }
  if (params.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function listPublicComments(slug: string) {
  return goApiFetch<ArticleComment[]>(
    `/public/articles/${encodeURIComponent(slug)}/comments`,
    { method: "GET" },
  );
}

export function createPublicComment(slug: string, input: CreatePublicCommentInput) {
  return goApiFetch<ArticleComment>(
    `/public/articles/${encodeURIComponent(slug)}/comments`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function listComments(params: ListCommentsParams = {}) {
  return goApiFetch<ArticleComment[]>(`/comments${toQuery(params)}`, {
    method: "GET",
  });
}

export function updateComment(id: string, input: UpdateCommentInput) {
  return goApiFetch<ArticleComment>(`/comments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteComment(id: string) {
  return goApiFetch<{ id: string }>(`/comments/${id}`, {
    method: "DELETE",
  });
}
