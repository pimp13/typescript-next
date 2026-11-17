"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow, parseISO } from "date-fns";
import { MessageCircleIcon, ReplyIcon, SendIcon } from "lucide-react";
import {
  useCreatePublicComment,
  usePublicComments,
} from "@/features/comments/hooks/use-comments";
import {
  publicCommentSchema,
  type PublicCommentFormValues,
} from "@/features/comments/schemas";
import type { ArticleComment } from "@/features/comments/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

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

function CommentItem({
  comment,
  onReply,
}: {
  comment: ArticleComment;
  onReply: (comment: ArticleComment) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground/90 text-xs font-semibold text-background">
              {comment.author_name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium tracking-tight">
                {comment.author_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatRelative(comment.created_at)}
              </p>
            </div>
          </div>
          {!comment.parent_id ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
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
      </div>

      {comment.replies && comment.replies.length > 0 ? (
        <div className="space-y-3 border-l border-border/70 pl-4 sm:ml-4 sm:pl-5">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} />
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

  const form = useForm<PublicCommentFormValues>({
    resolver: zodResolver(publicCommentSchema),
    defaultValues: {
      author_name: "",
      author_email: "",
      body: "",
    },
  });

  const comments = commentsQuery.data ?? [];
  const totalCount = useMemo(() => {
    return comments.reduce(
      (count, item) => count + 1 + (item.replies?.length ?? 0),
      0,
    );
  }, [comments]);

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
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/50 px-3 py-2 text-sm">
            <span className="text-muted-foreground">
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
          <Label htmlFor="comment-body">Comment</Label>
          <Textarea
            id="comment-body"
            rows={4}
            placeholder="Share your thoughts…"
            {...form.register("body")}
          />
          {form.formState.errors.body ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.body.message}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={createMutation.isPending}>
            <SendIcon data-icon="inline-start" />
            {createMutation.isPending ? "Posting..." : "Post comment"}
          </Button>
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

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={setReplyTo}
          />
        ))}
      </div>
    </section>
  );
}
