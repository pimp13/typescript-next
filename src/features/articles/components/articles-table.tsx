"use client";

import { format, parseISO } from "date-fns";
import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { ArticleStatusBadge } from "@/features/articles/components/article-status-badge";
import { ArticlesEmptyState } from "@/features/articles/components/articles-empty-state";
import type { Article } from "@/features/articles/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ArticlesTableProps = {
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

export function ArticlesTable({
  articles,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: ArticlesTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 rounded-2xl border border-border/70 bg-card/50 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ArticlesEmptyState variant="error" />;
  }

  if (articles.length === 0) {
    return <ArticlesEmptyState variant="empty" />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/60">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[42%]">Article</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Views</TableHead>
            <TableHead className="hidden lg:table-cell">Published</TableHead>
            <TableHead className="hidden md:table-cell">Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow
              key={article.id}
              className="group transition-colors hover:bg-muted/40"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-[linear-gradient(145deg,oklch(0.93_0.03_170),oklch(0.88_0.04_95))] dark:bg-[linear-gradient(145deg,oklch(0.28_0.03_170),oklch(0.22_0.03_95))]">
                    {article.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.cover_image}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="truncate font-medium tracking-tight">
                      {article.title}
                    </p>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      /{article.slug}
                    </p>
                    <p className="line-clamp-1 text-xs text-muted-foreground md:hidden">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <ArticleStatusBadge status={article.status} />
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                <span className="inline-flex items-center gap-1.5 tabular-nums">
                  <EyeIcon className="size-3.5 opacity-70" />
                  {article.view_count ?? 0}
                </span>
              </TableCell>
              <TableCell className="hidden text-muted-foreground lg:table-cell">
                {formatDate(article.published_at)}
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {formatDate(article.updated_at ?? article.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="inline-flex items-center gap-1 opacity-80 transition group-hover:opacity-100">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
