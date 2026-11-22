"use client";

import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  CornerDownRightIcon,
  MessageCircleIcon,
  ReplyIcon,
  SendIcon,
  XIcon,
} from "lucide-react";
import {
  useCreatePublicComment,
  usePublicComments,
} from "@/features/comments/hooks/use-comments";
import {
  publicCommentSchema,
  type PublicCommentFormValues,
} from "@/features/comments/schemas";
import type { ArticleComment } from "@/features/comments/types";
import { SaveButton } from "@/components/global/save-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "cn";

type ArticleCommentsProps = {
  slug: string;
};

function formatRelative(value: string) {
  try {
    return formatDistanceToNow(parseISO(value), { addSuffix: true });
  } catch {
    return "";
  }
}

function countThread(comments: ArticleComment[]): number {
  return comments.reduce(
    (total, comment) => total + 1 + countThread(comment.replies ?? []),
    0,
  );
}

function CommentItem({
  comment,
  depth = 0,
  onReply,
}: {
  comment: ArticleComment;
  depth?: number;
  onReply: (comment: ArticleComment) => void;
}) {
  const isReply = depth > 0 || Boolean(comment.parent_id);
  const replies = comment.replies ?? [];

  return (
    <div className={cn("space-y-3", isReply && "relative")}>
      <article
        className={cn(
          "rounded-2xl border p-4 transition-colors",
          isReply
            ? "border-border/50 bg-muted/25"
            : "border-border/70 bg-card/70 shadow-[0_1px_0_oklch(0_0_0/0.02)]",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                isReply
                  ? "bg-foreground/10 text-foreground"
                  : "bg-foreground/90 text-background",
              )}
            >
              {comment.author_name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <p className="truncate text-sm font-medium tracking-tight">
                  {comment.author_name}
                </p>
                {isReply ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    <CornerDownRightIcon className="size-2.5" />
                    Reply
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatRelative(comment.created_at)}
              </p>
            </div>
          </div>

          {depth < 1 ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="shrink-0"
              onClick={() => onReply(comment)}
            >
              <ReplyIcon data-icon="inline-start" />
              Reply
            </Button>
          ) : null}
        </div>

        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
          {comment.body}
        </p>
      </article>

      {replies.length > 0 ? (
        <div className="relative space-y-3 border-l-2 border-foreground/10 pl-4 sm:ml-5 sm:pl-5">
          <div className="absolute top-0 -left-px h-3 w-px bg-transparent" />
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ArticleComments({ slug }: ArticleCommentsProps) {
  const commentsQuery = usePublicComments(slug);
  const createMutation = useCreatePublicComment(slug);
  const [replyTo, setReplyTo] = useState<ArticleComment | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<PublicCommentFormValues>({
    resolver: zodResolver(publicCommentSchema),
    defaultValues: {
      author_name: "",
      author_email: "",
      body: "",
    },
  });

  const comments = commentsQuery.data ?? [];
  const totalCount = useMemo(() => countThread(comments), [comments]);

  const handleReply = (comment: ArticleComment) => {
    setReplyTo(comment);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      document.getElementById("comment-body")?.focus();
    }, 250);
  };

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6 border-t border-border/70 pt-10">
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            <MessageCircleIcon className="size-3.5" />
            Discussion
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {totalCount} {totalCount === 1 ? "comment" : "comments"}
          </h2>
        </div>
      </div>

      <form
        ref={formRef}
        className="grid gap-3 rounded-2xl border border-border/70 bg-card/50 p-4 sm:p-5"
        onSubmit={form.handleSubmit((values) => {
          createMutation.mutate(
            {
              author_name: values.author_name.trim(),
              ...(values.author_email?.trim()
                ? { author_email: values.author_email.trim() }
                : {}),
              body: values.body.trim(),
              ...(replyTo ? { parent_id: replyTo.id } : {}),
            },
            {
              onSuccess: () => {
                form.reset({
                  author_name: values.author_name,
                  author_email: values.author_email,
                  body: "",
                });
                setReplyTo(null);
              },
            },
          );
        })}
      >
        {replyTo ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-[linear-gradient(135deg,oklch(0.97_0.02_170),oklch(0.96_0.02_95))] px-3 py-2.5 text-sm dark:bg-[linear-gradient(135deg,oklch(0.26_0.02_170),oklch(0.24_0.02_95))]">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <CornerDownRightIcon className="size-3.5" />
              Replying to{" "}
              <span className="font-medium text-foreground">
                {replyTo.author_name}
              </span>
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setReplyTo(null)}
            >
              <XIcon data-icon="inline-start" />
              Cancel
            </Button>
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="comment-name">Name</Label>
            <Input id="comment-name" {...form.register("author_name")} />
            {form.formState.errors.author_name ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.author_name.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="comment-email">Email (optional)</Label>
            <Input
              id="comment-email"
              type="email"
              {...form.register("author_email")}
            />
            {form.formState.errors.author_email ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.author_email.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="comment-body">
            {replyTo ? "Your reply" : "Comment"}
          </Label>
          <Textarea
            id="comment-body"
            rows={4}
            placeholder={
              replyTo
                ? `Reply to ${replyTo.author_name}…`
                : "Share your thoughts…"
            }
            {...form.register("body")}
          />
          {form.formState.errors.body ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.body.message}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end">
          <SaveButton
            isPending={createMutation.isPending}
            icon={SendIcon}
            loadingText="Posting..."
          >
            {replyTo ? "Post reply" : "Post comment"}
          </SaveButton>
        </div>
      </form>

      {commentsQuery.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : null}

      {commentsQuery.isError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-6 text-sm text-muted-foreground">
          Could not load comments.
        </div>
      ) : null}

      {!commentsQuery.isLoading &&
      !commentsQuery.isError &&
      comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 px-4 py-10 text-center text-sm text-muted-foreground">
          Be the first to start the conversation.
        </div>
      ) : null}

      <div className="space-y-5">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
          />
        ))}
      </div>
    </section>
  );
}
