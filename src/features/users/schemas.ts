import { z } from "zod";

export const goRoleSlugSchema = z.enum([
  "user",
  "editor",
  "admin",
  "super_admin",
]);

export const usersFiltersSchema = z.object({
  search: z.string().max(80),
  role: z.enum(["ALL", "user", "editor", "admin", "super_admin"]),
});

export const createUserSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role_slug: goRoleSlugSchema,
});

export const updateUserSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.email("Enter a valid email"),
  password: z
    .string()
    .refine(
      (value) => value === "" || value.length >= 8,
      "Password must be at least 8 characters",
    ),
  role_slug: goRoleSlugSchema,
  status: z.enum(["active", "inactive", "banned"]),
});

export type UsersFiltersValues = z.infer<typeof usersFiltersSchema>;
export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
