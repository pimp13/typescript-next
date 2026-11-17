export type CommentStatus = "pending" | "approved" | "rejected" | "spam";

export type ArticleComment = {
  id: string;
  article_id: string;
  article_slug?: string;
  article_title?: string;
  parent_id?: string | null;
  user_id?: string | null;
  author_name: string;
  author_email?: string;
  body: string;
  status: CommentStatus;
  created_at: string;
  updated_at: string;
  replies?: ArticleComment[];
};

export type CreatePublicCommentInput = {
  author_name: string;
  author_email?: string;
  body: string;
  parent_id?: string;
};

export type UpdateCommentInput = {
  body?: string;
  status?: CommentStatus;
};

export type ListCommentsParams = {
  status?: CommentStatus | "all";
  article_id?: string;
  search?: string;
};
