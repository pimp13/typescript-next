"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { EyeIcon, SearchIcon } from "lucide-react";
import { usePublicArticles } from "@/features/articles/hooks/use-public-articles";
import { formatArticleDate } from "@/features/articles/lib/format-article-date";
import type { PublicArticleSummary } from "@/features/articles/types";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

function ArticleCard({
  article,
  featured = false,
}: {
  article: PublicArticleSummary;
  featured?: boolean;
}) {
  const dateLabel = formatArticleDate(
    article.published_at ?? article.created_at,
  );

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={
        featured
          ? "group relative grid overflow-hidden rounded-3xl border border-border/70 bg-card/70 shadow-[0_1px_0_oklch(0_0_0/0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-lg md:grid-cols-[1.15fr_0.85fr]"
          : "group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/70 transition duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-md"
      }
    >
      <div
        className={
          featured
            ? "relative min-h-64 overflow-hidden bg-[linear-gradient(145deg,oklch(0.92_0.04_170),oklch(0.88_0.05_95))] md:min-h-[22rem] dark:bg-[linear-gradient(145deg,oklch(0.28_0.04_170),oklch(0.22_0.04_95))]"
            : "relative aspect-[16/10] overflow-hidden bg-[linear-gradient(145deg,oklch(0.93_0.03_170),oklch(0.88_0.04_95))] dark:bg-[linear-gradient(145deg,oklch(0.28_0.03_170),oklch(0.22_0.03_95))]"
        }
      >
        {article.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover_image}
            alt=""
            className="size-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-end p-5">
            <span className="text-xs font-medium tracking-[0.2em] text-foreground/40 uppercase">
              Story
            </span>
          </div>
        )}
      </div>

      <div
        className={
          featured
            ? "flex flex-col justify-center gap-4 p-6 md:p-8"
            : "flex flex-1 flex-col gap-3 p-4"
        }
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {dateLabel ? <span>{dateLabel}</span> : null}
          <span className="inline-flex items-center gap-1">
            <EyeIcon className="size-3.5" />
            {article.view_count}
          </span>
          <span>{article.author_name}</span>
        </div>

        <div className="space-y-2">
          <h2
            className={
              featured
                ? "text-2xl font-semibold tracking-tight md:text-3xl"
                : "line-clamp-2 text-lg font-semibold tracking-tight"
            }
          >
            {article.title}
          </h2>
          <p
            className={
              featured
                ? "line-clamp-3 text-sm text-muted-foreground md:text-base"
                : "line-clamp-2 text-sm text-muted-foreground"
            }
          >
            {article.excerpt}
          </p>
        </div>

        <span className="mt-auto text-sm font-medium text-foreground/80 transition group-hover:text-foreground">
          Read story →
        </span>
      </div>
    </Link>
  );
}

export function ArticlesCatalog() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const articlesQuery = usePublicArticles(deferredSearch);

  const articles = articlesQuery.data ?? [];
  const featured = articles[0];
  const rest = useMemo(() => articles.slice(1), [articles]);

  return (
    <div className="grid gap-8">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-[radial-gradient(circle_at_top_right,oklch(0.93_0.05_95),transparent_42%),linear-gradient(160deg,oklch(0.99_0_0),oklch(0.96_0.02_170))] px-5 py-8 dark:bg-[radial-gradient(circle_at_top_right,oklch(0.32_0.05_95),transparent_42%),linear-gradient(160deg,oklch(0.22_0.01_160),oklch(0.18_0.02_170))] sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute -right-10 -bottom-16 size-56 rounded-full bg-[oklch(0.82_0.07_170/0.35)] blur-3xl dark:bg-[oklch(0.45_0.07_170/0.25)]" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <p className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
            Funlife journal
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Stories worth reading
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            Essays, notes, and product updates from the Funlife team —
            published through the Go articles API.
          </p>
        </div>
      </section>

      <div className="relative max-w-md">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search stories…"
          className="h-10 rounded-xl pl-9"
          aria-label="Search articles"
        />
      </div>

      {articlesQuery.isLoading ? (
        <div className="grid gap-4">
          <Skeleton className="h-72 w-full rounded-3xl md:h-80" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-72 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : null}

      {articlesQuery.isError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
          <p className="font-medium">Could not load stories</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Make sure the Go API is running and reachable.
          </p>
        </div>
      ) : null}

      {!articlesQuery.isLoading &&
      !articlesQuery.isError &&
      articles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 px-6 py-16 text-center">
          <p className="font-medium tracking-tight">No published stories yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Publish an article from the dashboard to see it here.
          </p>
        </div>
      ) : null}

      {featured ? (
        <div className="grid gap-4">
          <ArticleCard article={featured} featured />
          {rest.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
