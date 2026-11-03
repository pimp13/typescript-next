"use client";

import { useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import type { ChanPost } from "@/features/chan/types";
import { formatBytes, mediaUrl } from "@/features/chan/lib/media";
import { RenderComment } from "@/features/chan/lib/render-comment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PostCardProps = {
  post: ChanPost;
  boardSlug: string;
  threadId: string;
  onQuote?: (number: number) => void;
};

export function PostCard({ post, boardSlug, threadId, onQuote }: PostCardProps) {
  const [revealed, setRevealed] = useState(!post.isSpoiler);
  const image = mediaUrl(post.fileUrl);

  return (
    <article
      id={`p${post.number}`}
      className={cn(
        "scroll-mt-24 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm",
        post.isOp && "ring-1 ring-foreground/10",
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{post.name}</span>
        {post.tripcode ? (
          <span className="font-mono text-amber-600 dark:text-amber-400">
            !{post.tripcode}
          </span>
        ) : null}
        {post.isOp ? <Badge variant="secondary">OP</Badge> : null}
        <time dateTime={post.createdAt}>
          {format(parseISO(post.createdAt), "yyyy-MM-dd HH:mm:ss")}
        </time>
        <Link
          href={`/chan/${boardSlug}/thread/${threadId}#p${post.number}`}
          className="font-mono text-sky-600 hover:underline dark:text-sky-400"
        >
          No.{post.number}
        </Link>
        {onQuote ? (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => onQuote(post.number)}
          >
            Quote
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        {image ? (
          <div className="sm:w-48">
            <button
              type="button"
              className="group relative block overflow-hidden rounded-xl border border-border/60"
              onClick={() => setRevealed(true)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={post.fileName ?? "attachment"}
                className={cn(
                  "max-h-64 w-full object-cover transition",
                  !revealed && "scale-110 blur-xl",
                )}
              />
              {!revealed ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-medium text-white">
                  Spoiler — click to reveal
                </span>
              ) : null}
            </button>
            <p className="mt-1 truncate text-[11px] text-muted-foreground">
              {post.fileName} {formatBytes(post.fileSize)}
            </p>
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <RenderComment
            comment={post.comment}
            boardSlug={boardSlug}
            threadId={threadId}
          />
        </div>
      </div>
    </article>
  );
}
