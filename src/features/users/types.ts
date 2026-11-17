export type GoRoleSlug = "user" | "editor" | "admin" | "super_admin";

export type ManagedUserRole = {
  id: string;
  slug: string;
  name: string;
};

export type ManagedUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username?: string;
  phone?: string;
  status: "active" | "inactive" | "banned" | string;
  role: ManagedUserRole;
  last_login?: string | null;
  created_at: string;
  updated_at: string;
};

export type ListUsersParams = {
  search?: string;
  role?: string;
};

export type CreateUserInput = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_slug: GoRoleSlug | string;
  username?: string;
};

export type UpdateUserInput = {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  role_slug?: GoRoleSlug | string;
  status?: "active" | "inactive" | "banned";
};

export function userDisplayName(user: Pick<ManagedUser, "first_name" | "last_name" | "email">) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  return name || user.email;
}
