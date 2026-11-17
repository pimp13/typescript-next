import { z } from "zod";

export const createRoleSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(
      /^[a-z][a-z0-9_-]*$/,
      "Slug must start with a letter and use lowercase letters, numbers, - or _",
    ),
  name: z.string().min(2).max(100),
  description: z.string().max(255).optional().or(z.literal("")),
});

export const createPermissionSchema = z.object({
  resource: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z][a-z0-9_-]*$/, "Use lowercase resource slug"),
  action: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z][a-z0-9_-]*$/, "Use lowercase action slug"),
  name: z.string().max(100).optional().or(z.literal("")),
  description: z.string().max(255).optional().or(z.literal("")),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;
export type CreatePermissionFormValues = z.infer<typeof createPermissionSchema>;
