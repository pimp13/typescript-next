"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeftIcon, EyeIcon } from "lucide-react";
import { ApiError } from "@/lib/api";
import {
  usePublicArticle,
  useRecordArticleView,
} from "@/features/articles/hooks/use-public-articles";
import { formatArticleDate } from "@/features/articles/lib/format-article-date";
import { RichTextContent } from "@/components/editor";
import { Skeleton } from "@/components/ui/skeleton";

type ArticleReaderProps = {
  slug: string;
};

export function ArticleReader({ slug }: ArticleReaderProps) {
  const articleQuery = usePublicArticle(slug);
  const { mutate: recordView } = useRecordArticleView(slug);
  const recordedRef = useRef(false);

  useEffect(() => {
    if (!articleQuery.isSuccess || !articleQuery.data || recordedRef.current) {
      return;
    }

    const storageKey = `funlife.article-view.${slug}`;
    try {
      if (window.sessionStorage.getItem(storageKey)) {
        recordedRef.current = true;
        return;
      }
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // sessionStorage may be unavailable; still record once per mount
    }

    recordedRef.current = true;
    recordView();
  }, [articleQuery.isSuccess, articleQuery.data, recordView, slug]);

  if (articleQuery.isLoading) {
    return (
      <div className="grid gap-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="aspect-[21/9] w-full rounded-3xl" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (articleQuery.isError) {
    const notFound =
      articleQuery.error instanceof ApiError &&
      articleQuery.error.status === 404;

    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-border/70 px-6 py-14 text-center">
        <p className="text-lg font-semibold tracking-tight">
          {notFound ? "Story not found" : "Could not load story"}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {notFound
            ? "This article is unpublished or the link is wrong."
            : "Check that the Go API is available and try again."}
        </p>
        <Link
          href="/articles"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <ArrowLeftIcon className="size-4" />
          Back to stories
        </Link>
      </div>
    );
  }

  const article = articleQuery.data;
  if (!article) return null;

  const dateLabel = formatArticleDate(
    article.published_at ?? article.created_at,
  );

  return (
    <article className="grid gap-8">
      <div>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          All stories
        </Link>
      </div>

      <header className="space-y-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          {dateLabel ? <time dateTime={article.published_at ?? article.created_at}>{dateLabel}</time> : null}
          <span className="inline-flex items-center gap-1.5">
            <EyeIcon className="size-3.5" />
            <span className="tabular-nums">{article.view_count}</span>
            <span>views</span>
          </span>
          <span>by {article.author_name}</span>
        </div>

        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
            {article.title}
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            {article.excerpt}
          </p>
        </div>
      </header>

      <div className="relative aspect-[21/9] overflow-hidden rounded-[1.75rem] border border-border/70 bg-[linear-gradient(145deg,oklch(0.92_0.04_170),oklch(0.88_0.05_95))] dark:bg-[linear-gradient(145deg,oklch(0.28_0.04_170),oklch(0.22_0.04_95))]">
        {article.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover_image}
            alt=""
            className="size-full object-cover"
          />
        ) : null}
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <RichTextContent
          value={article.content}
          className="text-base leading-7 sm:text-[1.05rem] sm:leading-8"
        />
      </div>
    </article>
  );
}
