import { z } from "zod";

export const articleStatusSchema = z.enum(["draft", "published", "archived"]);

export const articlesFiltersSchema = z.object({
  search: z.string().max(80),
  status: z.enum(["all", "draft", "published", "archived"]),
});

export const articleFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
  slug: z
    .string()
    .max(255)
    .refine(
      (value) => value === "" || value.length >= 3,
      "Slug must be at least 3 characters",
    ),
  excerpt: z
    .string()
    .min(3, "Excerpt must be at least 3 characters")
    .max(500),
  content: z.string().min(3, "Content must be at least 3 characters"),
  cover_image: z
    .string()
    .max(500)
    .refine(
      (value) => value === "" || value.length >= 3,
      "Cover image must be at least 3 characters",
    ),
  status: articleStatusSchema,
});

export type ArticlesFiltersValues = z.infer<typeof articlesFiltersSchema>;
export type ArticleFormValues = z.infer<typeof articleFormSchema>;
