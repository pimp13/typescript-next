import { goApiFetch } from "@/lib/api";
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

  if (params.role?.trim()) {
    searchParams.set("role", params.role.trim());
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function listUsers(params: ListUsersParams = {}) {
  const response = await goApiFetch<{ users: ManagedUser[] }>(
    `/users/get-all${toQuery(params)}`,
    { method: "GET" },
  );
  return response.data?.users ?? [];
}

export async function createUser(input: CreateUserInput) {
  const response = await goApiFetch<ManagedUser>("/users/create", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function updateUser(id: string, input: UpdateUserInput) {
  const response = await goApiFetch<ManagedUser>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function deleteUser(id: string) {
  return goApiFetch<{ message: string }>(`/users/${id}`, {
    method: "DELETE",
  });
}
