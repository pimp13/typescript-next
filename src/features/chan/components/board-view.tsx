"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useBoardThreads,
  useCreateThread,
} from "@/features/chan/hooks/use-chan";
import { CatalogGrid } from "@/features/chan/components/catalog-grid";
import { ChanShell } from "@/features/chan/components/chan-shell";
import { ComposeForm } from "@/features/chan/components/compose-form";
import { ThreadCard } from "@/features/chan/components/thread-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type BoardViewProps = {
  slug: string;
};

export function BoardView({ slug }: BoardViewProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"list" | "catalog">("list");
  const [page, setPage] = useState(1);
  const threadsQuery = useBoardThreads(slug, { mode, page });
  const createMutation = useCreateThread(slug);

  const board = threadsQuery.data?.board;

  return (
    <ChanShell boardSlug={slug} title={board?.title}>
      <section className="mb-6 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          /{slug}/ — {board?.title ?? "Board"}
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {board?.description}
        </p>
      </section>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={mode === "list" ? "default" : "outline"}
          onClick={() => {
            setMode("list");
            setPage(1);
          }}
        >
          Index
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "catalog" ? "default" : "outline"}
          onClick={() => {
            setMode("catalog");
            setPage(1);
          }}
        >
          Catalog
        </Button>
      </div>

      <div className="mb-8">
        <ComposeForm
          mode="thread"
          forceImage={board?.forceImage}
          pending={createMutation.isPending}
          onSubmit={(formData) => {
            createMutation.mutate(formData, {
              onSuccess: (response) => {
                const threadId = (response.data as { thread?: { id: string } } | undefined)
                  ?.thread?.id;
                if (threadId) {
                  router.push(`/chan/${slug}/thread/${threadId}`);
                }
              },
            });
          }}
        />
      </div>

      {threadsQuery.isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : threadsQuery.isError || !threadsQuery.data ? (
        <p className="text-sm text-destructive">Failed to load threads.</p>
      ) : threadsQuery.data.threads.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No threads yet. Be the first to post.
        </p>
      ) : mode === "catalog" ? (
        <CatalogGrid boardSlug={slug} threads={threadsQuery.data.threads} />
      ) : (
        <div className="grid gap-4">
          {threadsQuery.data.threads.map((thread) => (
            <ThreadCard key={thread.id} boardSlug={slug} thread={thread} />
          ))}
        </div>
      )}

      {threadsQuery.data && threadsQuery.data.totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} / {threadsQuery.data.totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= threadsQuery.data.totalPages}
            onClick={() =>
              setPage((current) =>
                Math.min(threadsQuery.data!.totalPages, current + 1),
              )
            }
          >
            Next
          </Button>
        </div>
      ) : null}
    </ChanShell>
  );
}
