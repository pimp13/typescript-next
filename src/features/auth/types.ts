/** Legacy Fastify-compatible role labels used by existing dashboard gates. */
export type UserRole = "USER" | "SUPER_ADMIN" | "ADMIN_GENERAL";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** Go role slug, e.g. super_admin / editor / user */
  roleSlug: string;
  /** Go permission codes from RBAC */
  permissions: string[];
  isActive: boolean;
  lastLogin: string | null;
  createdAt?: string;
  updatedAt?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  status?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  username?: string;
};

export type GoAuthUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username?: string;
  phone?: string;
  role: string;
  permissions: string[];
  status: string;
};

export type GoSession = {
  expires_at: string;
  user: GoAuthUser;
};

export function mapGoRoleToLegacy(roleSlug: string): UserRole {
  switch (roleSlug) {
    case "super_admin":
    case "admin":
      return "SUPER_ADMIN";
    case "editor":
      return "ADMIN_GENERAL";
    default:
      return "USER";
  }
}

export function mapGoAuthUser(user: GoAuthUser): User {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  return {
    id: user.id,
    name: name || user.username || user.email,
    email: user.email,
    role: mapGoRoleToLegacy(user.role),
    roleSlug: user.role,
    permissions: user.permissions ?? [],
    isActive: user.status === "active",
    lastLogin: null,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    status: user.status,
  };
}

export function hasPermission(user: User | null | undefined, code: string) {
  return Boolean(user?.permissions?.includes(code));
}

export function hasAnyPermission(
  user: User | null | undefined,
  codes: string[],
) {
  return codes.some((code) => hasPermission(user, code));
}
