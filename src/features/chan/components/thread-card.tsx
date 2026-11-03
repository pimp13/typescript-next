"use client";

import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";
import { LockIcon, PinIcon } from "lucide-react";
import type { ChanThreadSummary } from "@/features/chan/types";
import { mediaUrl } from "@/features/chan/lib/media";
import { RenderComment } from "@/features/chan/lib/render-comment";
import { Badge } from "@/components/ui/badge";

type ThreadCardProps = {
  boardSlug: string;
  thread: ChanThreadSummary;
};

export function ThreadCard({ boardSlug, thread }: ThreadCardProps) {
  const href = `/chan/${boardSlug}/thread/${thread.id}`;
  const thumb = mediaUrl(thread.op?.fileUrl);

  return (
    <article className="rounded-2xl border border-border/70 bg-card/75 p-4 shadow-sm transition hover:border-border">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {thread.isSticky ? (
          <Badge variant="default" className="gap-1">
            <PinIcon className="size-3" /> Sticky
          </Badge>
        ) : null}
        {thread.isLocked ? (
          <Badge variant="outline" className="gap-1">
            <LockIcon className="size-3" /> Locked
          </Badge>
        ) : null}
        <Link href={href} className="text-sm font-semibold hover:underline">
          {thread.subject || `Thread No.${thread.op?.number ?? ""}`}
        </Link>
        <span className="text-xs text-muted-foreground">
          {thread.replyCount} replies · {thread.imageCount} images ·{" "}
          {formatDistanceToNow(parseISO(thread.bumpedAt), { addSuffix: true })}
        </span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        {thumb ? (
          <Link href={href} className="block shrink-0 overflow-hidden rounded-xl border border-border/60 sm:w-36">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumb} alt="" className="h-36 w-full object-cover" />
          </Link>
        ) : null}

        <div className="min-w-0 flex-1 space-y-3">
          {thread.op ? (
            <div>
              <p className="mb-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{thread.op.name}</span>{" "}
                No.{thread.op.number}
              </p>
              <RenderComment
                comment={thread.op.comment}
                boardSlug={boardSlug}
                threadId={thread.id}
              />
            </div>
          ) : null}

          {thread.lastReplies.map((reply) => (
            <div
              key={reply.id}
              className="rounded-xl border border-border/50 bg-muted/20 px-3 py-2"
            >
              <p className="mb-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{reply.name}</span>{" "}
                No.{reply.number}
              </p>
              <RenderComment
                comment={reply.comment}
                boardSlug={boardSlug}
                threadId={thread.id}
              />
            </div>
          ))}

          <Link href={href} className="inline-flex text-sm text-sky-600 hover:underline dark:text-sky-400">
            Open thread
          </Link>
        </div>
      </div>
    </article>
  );
}
