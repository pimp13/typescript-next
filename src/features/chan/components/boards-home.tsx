"use client";

import Link from "next/link";
import { useBoards } from "@/features/chan/hooks/use-chan";
import { ChanShell } from "@/features/chan/components/chan-shell";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function BoardsHome() {
  const { data, isLoading, isError } = useBoards();

  return (
    <ChanShell>
      <section className="mb-8 space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Imageboard</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Funlife Chan
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          A modern anonymous board system — catalogs, quotes, tripcodes, spoilers,
          bumping, stickies, and moderation tools.
        </p>
      </section>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load boards.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((board) => (
            <Link
              key={board.id}
              href={`/chan/${board.slug}`}
              className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-border"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-tight">
                  /{board.slug}/
                </h2>
                <div className="flex gap-1">
                  {board.isNsfw ? <Badge variant="destructive">NSFW</Badge> : null}
                  {board.isWorksafe ? <Badge variant="secondary">SFW</Badge> : null}
                </div>
              </div>
              <p className="mb-4 text-sm font-medium">{board.title}</p>
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {board.description}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                {board._count?.threads ?? 0} threads · {board.postCount} posts
              </p>
            </Link>
          ))}
        </div>
      )}
    </ChanShell>
  );
}
