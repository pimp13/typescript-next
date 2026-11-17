import { z } from "zod";

export const publicCommentSchema = z.object({
  author_name: z.string().min(2, "Name must be at least 2 characters").max(120),
  author_email: z
    .string()
    .max(255)
    .refine(
      (value) => value === "" || z.email().safeParse(value).success,
      "Enter a valid email",
    ),
  body: z.string().min(2, "Comment must be at least 2 characters").max(4000),
});

export const commentsFiltersSchema = z.object({
  search: z.string().max(80),
  status: z.enum(["all", "pending", "approved", "rejected", "spam"]),
});

export type PublicCommentFormValues = z.infer<typeof publicCommentSchema>;
export type CommentsFiltersValues = z.infer<typeof commentsFiltersSchema>;
