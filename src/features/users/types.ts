import type { User, UserRole } from "@/features/auth/types";

export type ManagedUser = User;

export type ListUsersParams = {
  search?: string;
  role?: UserRole;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
};
