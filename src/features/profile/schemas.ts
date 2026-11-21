import { z } from "zod";

export const updateProfileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  username: z
    .string()
    .refine(
      (value) =>
        value === "" ||
        (/^[a-zA-Z][a-zA-Z0-9]{2,49}$/.test(value) && value.length >= 3),
      "Username must be 3–50 letters/numbers and start with a letter",
    ),
  phone: z.string().max(20).optional().or(z.literal("")),
  avatar: z
    .string()
    .max(500)
    .refine(
      (value) =>
        value === "" ||
        /^https?:\/\//i.test(value) ||
        value.startsWith("/uploads/"),
      "Avatar must be an http(s) URL or an uploaded media path",
    ),
});

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "New password must be at least 8 characters"),
    confirm_password: z.string().min(8, "Confirm your new password"),
  })
  .refine((values) => values.new_password === values.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
