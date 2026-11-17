import { goApiFetch } from "@/lib/api";
import type {
  CreatePermissionInput,
  CreateRoleInput,
  RbacPermission,
  RbacRole,
  RbacUser,
  SetRolePermissionsInput,
  SetRoleToUserInput,
} from "@/features/rbac/types";

export async function listPermissions() {
  const response = await goApiFetch<{ permissions: RbacPermission[] }>(
    "/admin/rbac/permissions",
    { method: "GET" },
  );
  return response.data?.permissions ?? [];
}

export function createPermission(input: CreatePermissionInput) {
  return goApiFetch<RbacPermission>("/admin/rbac/permissions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function listRoles() {
  const response = await goApiFetch<{ roles: RbacRole[] }>("/admin/rbac/roles", {
    method: "GET",
  });
  return response.data?.roles ?? [];
}

export function createRole(input: CreateRoleInput) {
  return goApiFetch<RbacRole>("/admin/rbac/roles", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteRole(id: string) {
  return goApiFetch<{ message: string }>(`/admin/rbac/roles/${id}`, {
    method: "DELETE",
  });
}

export function setRolePermissions(id: string, input: SetRolePermissionsInput) {
  return goApiFetch<RbacRole>(`/admin/rbac/roles/${id}/permissions`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function setRoleToUser(roleId: string, input: SetRoleToUserInput) {
  return goApiFetch<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: RbacRole;
  }>(`/admin/rbac/roles/${roleId}/users`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function listGoUsers() {
  const response = await goApiFetch<{ users: RbacUser[] }>("/users/get-all", {
    method: "GET",
  });
  return response.data?.users ?? [];
}
