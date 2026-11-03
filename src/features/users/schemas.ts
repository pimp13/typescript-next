import { z } from "zod";

export const userRoleSchema = z.enum(["USER", "SUPER_ADMIN"]);

export const usersFiltersSchema = z.object({
  search: z.string().max(80),
  role: z.enum(["ALL", "USER", "SUPER_ADMIN"]),
});

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: userRoleSchema,
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email"),
  password: z
    .string()
    .refine(
      (value) => value === "" || value.length >= 6,
      "Password must be at least 6 characters",
    ),
  role: userRoleSchema,
});

export type UsersFiltersValues = z.infer<typeof usersFiltersSchema>;
export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
