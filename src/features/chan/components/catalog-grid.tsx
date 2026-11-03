"use client";

import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";
import type { ChanThreadSummary } from "@/features/chan/types";
import { mediaUrl } from "@/features/chan/lib/media";
import { Badge } from "@/components/ui/badge";

type CatalogGridProps = {
  boardSlug: string;
  threads: ChanThreadSummary[];
};

export function CatalogGrid({ boardSlug, threads }: CatalogGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {threads.map((thread) => {
        const href = `/chan/${boardSlug}/thread/${thread.id}`;
        const thumb = mediaUrl(thread.op?.fileUrl);

        return (
          <Link
            key={thread.id}
            href={href}
            className="group overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-sm transition hover:-translate-y-0.5 hover:border-border"
          >
            <div className="aspect-square overflow-hidden bg-muted/40">
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumb}
                  alt=""
                  className="size-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                  Text only
                </div>
              )}
            </div>
            <div className="space-y-2 p-3">
              <div className="flex flex-wrap gap-1">
                {thread.isSticky ? <Badge>Sticky</Badge> : null}
                {thread.isLocked ? <Badge variant="outline">Locked</Badge> : null}
              </div>
              <p className="line-clamp-2 text-sm font-medium">
                {thread.subject || thread.op?.comment || "Untitled thread"}
              </p>
              <p className="text-xs text-muted-foreground">
                R:{thread.replyCount} · I:{thread.imageCount} ·{" "}
                {formatDistanceToNow(parseISO(thread.bumpedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
