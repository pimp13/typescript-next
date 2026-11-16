"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpenIcon, PlusIcon } from "lucide-react";
import { ApiError } from "@/lib/api";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import {
  useArticles,
  useCreateArticle,
  useDeleteArticle,
  useUpdateArticle,
} from "@/features/articles/hooks/use-articles";
import type {
  ArticleFormValues,
  ArticlesFiltersValues,
} from "@/features/articles/schemas";
import type { Article } from "@/features/articles/types";
import { ArticleFormDialog } from "@/features/articles/components/article-form-dialog";
import { ArticlesFilters } from "@/features/articles/components/articles-filters";
import { ArticlesGrid } from "@/features/articles/components/articles-grid";
import { ArticlesTable } from "@/features/articles/components/articles-table";
import type { ArticlesViewMode } from "@/features/articles/components/articles-view-toggle";
import { DeleteArticleDialog } from "@/features/articles/components/delete-article-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const initialFilters: ArticlesFiltersValues = {
  search: "",
  status: "all",
};

const VIEW_MODE_KEY = "funlife.articles.viewMode";

const adminRoles = new Set(["SUPER_ADMIN", "ADMIN_GENERAL"]);

export function ArticlesManagement() {
  const router = useRouter();
  const {
    data: currentUser,
    isLoading: isAuthLoading,
    isError,
    error,
  } = useCurrentUser();

  const [filters, setFilters] = useState<ArticlesFiltersValues>(initialFilters);
  const [viewMode, setViewMode] = useState<ArticlesViewMode>("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(VIEW_MODE_KEY);
      if (stored === "grid" || stored === "table") {
        setViewMode(stored);
      }
    } catch {
      // ignore storage access errors
    }
  }, []);

  const onViewModeChange = useCallback((mode: ArticlesViewMode) => {
    setViewMode(mode);
    try {
      window.localStorage.setItem(VIEW_MODE_KEY, mode);
    } catch {
      // ignore storage access errors
    }
  }, []);

  const listParams = useMemo(
    () => ({
      search: filters.search,
      status: filters.status,
    }),
    [filters],
  );

  const articlesQuery = useArticles(listParams);
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();
  const deleteMutation = useDeleteArticle();

  const onFiltersChange = useCallback((next: ArticlesFiltersValues) => {
    setFilters((prev) => {
      if (prev.search === next.search && prev.status === next.status) {
        return prev;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (isError && error instanceof ApiError && error.status === 401) {
      router.replace("/login");
    }
  }, [error, isError, router]);

  useEffect(() => {
    if (
      !isAuthLoading &&
      currentUser &&
      !adminRoles.has(currentUser.role)
    ) {
      router.replace("/dashboard");
    }
  }, [currentUser, isAuthLoading, router]);

  const articles = articlesQuery.data ?? [];
  const publishedCount = articles.filter((a) => a.status === "published").length;
  const draftCount = articles.filter((a) => a.status === "draft").length;

  if (isAuthLoading || !currentUser) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-72 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!adminRoles.has(currentUser.role)) {
    return null;
  }

  return (
    <div className="grid gap-6">
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-[radial-gradient(circle_at_top_right,oklch(0.93_0.04_95),transparent_45%),linear-gradient(165deg,oklch(0.99_0_0),oklch(0.96_0.02_170))] p-5 dark:bg-[radial-gradient(circle_at_top_right,oklch(0.32_0.04_95),transparent_42%),linear-gradient(165deg,oklch(0.22_0.01_160),oklch(0.18_0.02_170))] md:p-6">
        <div className="pointer-events-none absolute -right-8 -bottom-10 size-44 rounded-full bg-[oklch(0.82_0.06_170/0.35)] blur-2xl dark:bg-[oklch(0.45_0.06_170/0.25)]" />
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-xs text-muted-foreground backdrop-blur-sm">
              <BookOpenIcon className="size-3.5" />
              Editorial workspace
            </div>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Articles
              </h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Write, publish, and archive stories through the Go articles API.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-4 rounded-xl border border-border/60 bg-background/65 px-4 py-2.5 text-sm backdrop-blur-sm">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-semibold tabular-nums">{articles.length}</p>
              </div>
              <div className="w-px bg-border/70" />
              <div>
                <p className="text-xs text-muted-foreground">Live</p>
                <p className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {publishedCount}
                </p>
              </div>
              <div className="w-px bg-border/70" />
              <div>
                <p className="text-xs text-muted-foreground">Drafts</p>
                <p className="font-semibold tabular-nums">{draftCount}</p>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => {
                setFormMode("create");
                setSelectedArticle(null);
                setFormOpen(true);
              }}
            >
              <PlusIcon data-icon="inline-start" />
              New article
            </Button>
          </div>
        </div>
      </section>

      <ArticlesFilters
        values={filters}
        onChange={onFiltersChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />

      {viewMode === "grid" ? (
        <ArticlesGrid
          articles={articles}
          isLoading={articlesQuery.isLoading}
          isError={articlesQuery.isError}
          onEdit={(article) => {
            setSelectedArticle(article);
            setFormMode("edit");
            setFormOpen(true);
          }}
          onDelete={(article) => {
            setSelectedArticle(article);
            setDeleteOpen(true);
          }}
        />
      ) : (
        <ArticlesTable
          articles={articles}
          isLoading={articlesQuery.isLoading}
          isError={articlesQuery.isError}
          onEdit={(article) => {
            setSelectedArticle(article);
            setFormMode("edit");
            setFormOpen(true);
          }}
          onDelete={(article) => {
            setSelectedArticle(article);
            setDeleteOpen(true);
          }}
        />
      )}

      <ArticleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        article={selectedArticle}
        pending={createMutation.isPending || updateMutation.isPending}
        onSubmit={(values: ArticleFormValues) => {
          const payload = {
            title: values.title,
            excerpt: values.excerpt,
            content: values.content,
            status: values.status,
            ...(values.slug.trim() ? { slug: values.slug.trim() } : {}),
            ...(values.cover_image.trim()
              ? { cover_image: values.cover_image.trim() }
              : {}),
          };

          if (formMode === "edit" && selectedArticle) {
            updateMutation.mutate(
              { id: selectedArticle.id, input: payload },
              {
                onSuccess: () => {
                  setFormOpen(false);
                  setSelectedArticle(null);
                },
              },
            );
            return;
          }

          createMutation.mutate(payload, {
            onSuccess: () => {
              setFormOpen(false);
            },
          });
        }}
      />

      <DeleteArticleDialog
        article={selectedArticle}
        open={deleteOpen}
        pending={deleteMutation.isPending}
        onOpenChange={setDeleteOpen}
        onConfirm={() => {
          if (!selectedArticle) return;
          deleteMutation.mutate(selectedArticle.id, {
            onSuccess: () => {
              setDeleteOpen(false);
              setSelectedArticle(null);
            },
          });
        }}
      />
    </div>
  );
}
