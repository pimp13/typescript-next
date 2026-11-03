"use client";

import { useState } from "react";
import Link from "next/link";
import { LockIcon, PinIcon } from "lucide-react";
import {
  useCreateReply,
  useThread,
} from "@/features/chan/hooks/use-chan";
import { ChanShell } from "@/features/chan/components/chan-shell";
import { ComposeForm } from "@/features/chan/components/compose-form";
import { PostCard } from "@/features/chan/components/post-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type ThreadViewProps = {
  slug: string;
  threadId: string;
};

export function ThreadView({ slug, threadId }: ThreadViewProps) {
  const [quoteDraft, setQuoteDraft] = useState("");
  const threadQuery = useThread(slug, threadId);
  const replyMutation = useCreateReply(slug, threadId);

  const thread = threadQuery.data?.thread;
  const board = threadQuery.data?.board;

  return (
    <ChanShell boardSlug={slug} title={thread?.subject ?? "Thread"}>
      <div className="mb-6 space-y-3">
        <Link
          href={`/chan/${slug}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to /{slug}/
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {thread?.isSticky ? (
            <Badge className="gap-1">
              <PinIcon className="size-3" /> Sticky
            </Badge>
          ) : null}
          {thread?.isLocked ? (
            <Badge variant="outline" className="gap-1">
              <LockIcon className="size-3" /> Locked
            </Badge>
          ) : null}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {thread?.subject || `Thread on /${slug}/`}
        </h1>
        <p className="text-sm text-muted-foreground">
          {thread?.replyCount ?? 0} replies · {thread?.imageCount ?? 0} images
        </p>
      </div>

      {threadQuery.isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : threadQuery.isError || !thread ? (
        <p className="text-sm text-destructive">Failed to load thread.</p>
      ) : (
        <div className="grid gap-4">
          {thread.posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              boardSlug={slug}
              threadId={threadId}
              onQuote={(number) => {
                setQuoteDraft((current) =>
                  current ? `${current}\n>>${number}\n` : `>>${number}\n`,
                );
                document
                  .getElementById("reply-composer")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            />
          ))}
        </div>
      )}

      <div id="reply-composer" className="mt-8">
        {thread?.isLocked ? (
          <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
            This thread is locked. New replies are disabled.
          </div>
        ) : (
          <ComposeForm
            key={quoteDraft}
            mode="reply"
            forceImage={board?.forceImage}
            pending={replyMutation.isPending}
            initialComment={quoteDraft}
            onSubmit={(formData) => {
              replyMutation.mutate(formData, {
                onSuccess: () => setQuoteDraft(""),
              });
            }}
          />
        )}
      </div>
    </ChanShell>
  );
}
