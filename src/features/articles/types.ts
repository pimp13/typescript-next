export type ArticleStatus = "draft" | "published" | "archived";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  status: ArticleStatus;
  published_at: string | null;
  meta: Record<string, unknown> | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  view_count: number;
};

export type ListArticlesParams = {
  status?: ArticleStatus | "all";
  search?: string;
};

export type CreateArticleInput = {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  status: ArticleStatus;
  published_at?: string | null;
  meta?: Record<string, unknown>;
};

export type UpdateArticleInput = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  status?: ArticleStatus;
  published_at?: string | null;
  meta?: Record<string, unknown>;
};
