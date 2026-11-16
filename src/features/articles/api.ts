import { goApiFetch } from "@/lib/api";
import type {
  Article,
  CreateArticleInput,
  ListArticlesParams,
  UpdateArticleInput,
} from "@/features/articles/types";

function toQuery(params: ListArticlesParams) {
  const searchParams = new URLSearchParams();

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function listArticles(params: ListArticlesParams = {}) {
  return goApiFetch<Article[]>(`/articles${toQuery(params)}`, {
    method: "GET",
  });
}

export function getArticle(id: string) {
  return goApiFetch<Article>(`/articles/${id}`, {
    method: "GET",
  });
}

export function createArticle(input: CreateArticleInput) {
  return goApiFetch<Article>("/articles/create", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateArticle(id: string, input: UpdateArticleInput) {
  return goApiFetch<Article>(`/articles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteArticle(id: string) {
  return goApiFetch<{ id: string }>(`/articles/${id}`, {
    method: "DELETE",
  });
}
