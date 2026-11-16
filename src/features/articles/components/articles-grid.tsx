"use client";

import { format, parseISO } from "date-fns";
import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { ArticleStatusBadge } from "@/features/articles/components/article-status-badge";
import type { Article } from "@/features/articles/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type ArticlesGridProps = {
  articles: Article[];
  isLoading?: boolean;
  isError?: boolean;
  onEdit: (article: Article) => void;
  onDelete: (article: Article) => void;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  try {
    return format(parseISO(value), "MMM d, yyyy");
  } catch {
    return "—";
  }
}

export function ArticlesGrid({
  articles,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: ArticlesGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-border/70 bg-card/50"
          >
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <p className="text-sm font-medium text-foreground">
          Could not load articles
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in against the Go API and ensure you have{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            articles:read
          </code>
          .
        </p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-16 text-center">
        <p className="text-base font-medium tracking-tight">No articles yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first draft to populate this workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {articles.map((article) => (
        <article
          key={article.id}
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-[0_1px_0_oklch(0_0_0/0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-md"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(145deg,oklch(0.93_0.03_170),oklch(0.88_0.04_95))] dark:bg-[linear-gradient(145deg,oklch(0.28_0.03_170),oklch(0.22_0.03_95))]">
            {article.cover_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.cover_image}
                alt=""
                className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex size-full items-end p-4">
                <span className="text-xs font-medium tracking-[0.18em] text-foreground/50 uppercase">
                  No cover
                </span>
              </div>
            )}
            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
              <ArticleStatusBadge status={article.status} />
              <span className="inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-[11px] text-muted-foreground backdrop-blur-sm">
                <EyeIcon className="size-3" />
                {article.view_count ?? 0}
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="space-y-1.5">
              <h3 className="line-clamp-2 text-base font-semibold tracking-tight">
                {article.title}
              </h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {article.excerpt}
              </p>
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 pt-1">
              <div className="min-w-0 text-xs text-muted-foreground">
                <p className="truncate font-mono">{article.slug}</p>
                <p>{formatDate(article.published_at ?? article.created_at)}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Edit ${article.title}`}
                  onClick={() => onEdit(article)}
                >
                  <PencilIcon className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Delete ${article.title}`}
                  onClick={() => onDelete(article)}
                >
                  <Trash2Icon className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
