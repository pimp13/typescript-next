import { apiFetch } from "@/lib/api";
import type { ChanBoard, ChanPost, ChanThreadSummary } from "@/features/chan/types";

export type ChanAdminStats = {
  boards: number;
  threads: number;
  posts: number;
  activeBans: number;
  nsfwBoards: number;
};

export type AdminThread = {
  id: string;
  subject: string | null;
  isSticky: boolean;
  isLocked: boolean;
  replyCount: number;
  imageCount: number;
  bumpedAt: string;
  board: { slug: string; title: string };
  posts: ChanPost[];
};

export type AdminPost = ChanPost & {
  board: { slug: string; title: string };
  thread: { id: string; subject: string | null };
  ipHash?: string;
};

export type AdminBan = {
  id: string;
  ipHash: string;
  reason: string;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy: { id: string; name: string; email: string } | null;
};

export function getChanAdminStats() {
  return apiFetch<ChanAdminStats>("/api/admin/chan/stats", { method: "GET" });
}

export function listAdminBoards() {
  return apiFetch<ChanBoard[]>("/api/admin/chan/boards", { method: "GET" });
}

export function createAdminBoard(body: Record<string, unknown>) {
  return apiFetch<ChanBoard>("/api/admin/chan/boards", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateAdminBoard(id: string, body: Record<string, unknown>) {
  return apiFetch<ChanBoard>(`/api/admin/chan/boards/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function deleteAdminBoard(id: string) {
  return apiFetch<ChanBoard>(`/api/admin/chan/boards/${id}`, {
    method: "DELETE",
  });
}

export function listAdminThreads() {
  return apiFetch<AdminThread[]>("/api/admin/chan/threads", { method: "GET" });
}

export function updateAdminThread(
  id: string,
  body: { isSticky?: boolean; isLocked?: boolean },
) {
  return apiFetch(`/api/admin/chan/threads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function deleteAdminThread(id: string) {
  return apiFetch(`/api/admin/chan/threads/${id}`, { method: "DELETE" });
}

export function listAdminPosts() {
  return apiFetch<AdminPost[]>("/api/admin/chan/posts", { method: "GET" });
}

export function deleteAdminPost(id: string) {
  return apiFetch(`/api/admin/chan/posts/${id}`, { method: "DELETE" });
}

export function listAdminBans() {
  return apiFetch<AdminBan[]>("/api/admin/chan/bans", { method: "GET" });
}

export function createAdminBan(body: {
  postId?: string;
  ipHash?: string;
  reason: string;
  expiresAt?: string | null;
}) {
  return apiFetch<AdminBan>("/api/admin/chan/bans", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function deactivateAdminBan(id: string) {
  return apiFetch(`/api/admin/chan/bans/${id}`, { method: "DELETE" });
}

export type { ChanThreadSummary };
