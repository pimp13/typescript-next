import { apiFetch } from "@/lib/api";
import type {
  ChanBoard,
  ChanThreadDetail,
  ChanThreadListResponse,
} from "@/features/chan/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export function listBoards() {
  return apiFetch<ChanBoard[]>("/api/chan/boards", { method: "GET" });
}

export function getBoard(slug: string) {
  return apiFetch<ChanBoard>(`/api/chan/boards/${slug}`, { method: "GET" });
}

export function listThreads(
  slug: string,
  params: { mode?: "list" | "catalog"; page?: number; limit?: number } = {},
) {
  const search = new URLSearchParams();
  if (params.mode) search.set("mode", params.mode);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const query = search.toString();

  return apiFetch<ChanThreadListResponse>(
    `/api/chan/boards/${slug}/threads${query ? `?${query}` : ""}`,
    { method: "GET" },
  );
}

export function getThread(slug: string, threadId: string) {
  return apiFetch<ChanThreadDetail>(
    `/api/chan/boards/${slug}/threads/${threadId}`,
    { method: "GET" },
  );
}

async function postMultipart<T>(path: string, formData: FormData) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const payload = (await response.json()) as {
    ok: boolean;
    message: string;
    data?: T;
  };

  if (!response.ok || !payload.ok) {
    const { ApiError } = await import("@/lib/api");
    throw new ApiError(payload.message || "Request failed", response.status);
  }

  return payload;
}

export function createThread(slug: string, formData: FormData) {
  return postMultipart(`/api/chan/boards/${slug}/threads`, formData);
}

export function createReply(slug: string, threadId: string, formData: FormData) {
  return postMultipart(
    `/api/chan/boards/${slug}/threads/${threadId}/replies`,
    formData,
  );
}
