export type RbacPermission = {
  id: string;
  code: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
};

export type RbacRole = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  is_system: boolean;
  permissions: RbacPermission[];
};

export type RbacUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username?: string;
  status?: string;
  role_id?: string;
  role?: {
    id?: string;
    slug?: string;
    name?: string;
  };
};

export type CreateRoleInput = {
  slug: string;
  name: string;
  description?: string;
  permission_codes?: string[];
};

export type CreatePermissionInput = {
  resource: string;
  action: string;
  name?: string;
  description?: string;
  code?: string;
};

export type SetRolePermissionsInput = {
  permission_codes: string[];
  action: "add" | "remove" | "replace";
};

export type SetRoleToUserInput = {
  user_id: string;
  action: "assign" | "remove";
};
