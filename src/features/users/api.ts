import { apiFetch } from "@/lib/api";
import type {
  CreateUserInput,
  ListUsersParams,
  ManagedUser,
  UpdateUserInput,
} from "@/features/users/types";

function toQuery(params: ListUsersParams) {
  const searchParams = new URLSearchParams();

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.role) {
    searchParams.set("role", params.role);
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function listUsers(params: ListUsersParams = {}) {
  return apiFetch<ManagedUser[]>(`/api/users${toQuery(params)}`, {
    method: "GET",
  });
}

export function createUser(input: CreateUserInput) {
  return apiFetch<ManagedUser>("/api/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateUser(id: string, input: UpdateUserInput) {
  return apiFetch<ManagedUser>(`/api/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteUser(id: string) {
  return apiFetch<ManagedUser>(`/api/users/${id}`, {
    method: "DELETE",
  });
}
