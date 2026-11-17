"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import {
  CheckIcon,
  MessageSquareIcon,
  ShieldXIcon,
  Trash2Icon,
} from "lucide-react";
import { ApiError } from "@/lib/api";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import {
  useAdminComments,
  useDeleteComment,
  useUpdateComment,
} from "@/features/comments/hooks/use-comments";
import type { CommentsFiltersValues } from "@/features/comments/schemas";
import type { ArticleComment, CommentStatus } from "@/features/comments/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const adminRoles = new Set(["SUPER_ADMIN"]);

const initialFilters: CommentsFiltersValues = {
  search: "",
  status: "all",
};

const statusVariant: Record<
  CommentStatus,
  "secondary" | "success" | "warning" | "destructive"
> = {
  pending: "warning",
  approved: "success",
  rejected: "secondary",
  spam: "destructive",
};

export function CommentsManagement() {
  const router = useRouter();
  const {
    data: currentUser,
    isLoading: isAuthLoading,
    isError,
    error,
  } = useCurrentUser();

  const [filters, setFilters] = useState<CommentsFiltersValues>(initialFilters);
  const [deleteTarget, setDeleteTarget] = useState<ArticleComment | null>(null);

  const listParams = useMemo(
    () => ({
      search: filters.search,
      status: filters.status,
    }),
    [filters],
  );

  const commentsQuery = useAdminComments(listParams);
  const updateMutation = useUpdateComment();
  const deleteMutation = useDeleteComment();

  const onSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  useEffect(() => {
    if (isError && error instanceof ApiError && error.status === 401) {
      router.replace("/login");
    }
  }, [error, isError, router]);

  useEffect(() => {
    if (!isAuthLoading && currentUser && !adminRoles.has(currentUser.role)) {
      router.replace("/dashboard");
    }
  }, [currentUser, isAuthLoading, router]);

  const comments = commentsQuery.data ?? [];
  const pendingCount = comments.filter((c) => c.status === "pending").length;

  if (isAuthLoading || !currentUser) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (!adminRoles.has(currentUser.role)) {
    return null;
  }

  return (
    <div className="grid gap-6">
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-[radial-gradient(circle_at_top_right,oklch(0.93_0.04_95),transparent_45%),linear-gradient(165deg,oklch(0.99_0_0),oklch(0.96_0.02_170))] p-5 dark:bg-[radial-gradient(circle_at_top_right,oklch(0.32_0.04_95),transparent_42%),linear-gradient(165deg,oklch(0.22_0.01_160),oklch(0.18_0.02_170))] md:p-6">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-xs text-muted-foreground backdrop-blur-sm">
              <MessageSquareIcon className="size-3.5" />
              Moderation
            </div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Comments
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Review reader discussion across published articles.
            </p>
          </div>
          <div className="flex gap-4 rounded-xl border border-border/60 bg-background/65 px-4 py-2.5 text-sm backdrop-blur-sm">
            <div>
              <p className="text-xs text-muted-foreground">Loaded</p>
              <p className="font-semibold tabular-nums">{comments.length}</p>
            </div>
            <div className="w-px bg-border/70" />
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="font-semibold tabular-nums text-amber-600 dark:text-amber-400">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-3 rounded-2xl border border-border/70 bg-card/60 p-3 sm:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="grid gap-1.5">
          <Label htmlFor="comments-search">Search</Label>
          <Input
            id="comments-search"
            placeholder="Author, email, or body…"
            value={filters.search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="comments-status">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => {
              if (!value) return;
              setFilters((prev) => ({
                ...prev,
                status: value as CommentsFiltersValues["status"],
              }));
            }}
          >
            <SelectTrigger id="comments-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="spam">Spam</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {commentsQuery.isLoading ? (
        <div className="space-y-3 rounded-2xl border border-border/70 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : null}

      {commentsQuery.isError ? (
        <div className="rounded-2xl border border-destructive/30 p-6 text-sm text-muted-foreground">
          Could not load comments. Sign in to the Go API with{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            comments:read
          </code>
          .
        </div>
      ) : null}

      {!commentsQuery.isLoading &&
      !commentsQuery.isError &&
      comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 px-6 py-14 text-center text-sm text-muted-foreground">
          No comments match these filters.
        </div>
      ) : null}

      {!commentsQuery.isLoading &&
      !commentsQuery.isError &&
      comments.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/60">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[42%]">Comment</TableHead>
                <TableHead>Article</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">When</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{comment.author_name}</p>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {comment.body}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[12rem]">
                      <p className="truncate text-sm">
                        {comment.article_title || "—"}
                      </p>
                      <p className="truncate font-mono text-xs text-muted-foreground">
                        {comment.article_slug ? `/${comment.article_slug}` : ""}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[comment.status]}>
                      {comment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {format(parseISO(comment.created_at), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      {comment.status !== "approved" ? (
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Approve"
                          disabled={updateMutation.isPending}
                          onClick={() =>
                            updateMutation.mutate({
                              id: comment.id,
                              input: { status: "approved" },
                            })
                          }
                        >
                          <CheckIcon className="size-4 text-emerald-600" />
                        </Button>
                      ) : null}
                      {comment.status !== "spam" ? (
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Mark spam"
                          disabled={updateMutation.isPending}
                          onClick={() =>
                            updateMutation.mutate({
                              id: comment.id,
                              input: { status: "spam" },
                            })
                          }
                        >
                          <ShieldXIcon className="size-4 text-amber-600" />
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Delete"
                        onClick={() => setDeleteTarget(comment)}
                      >
                        <Trash2Icon className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the comment from{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.author_name}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (!deleteTarget) return;
                deleteMutation.mutate(deleteTarget.id, {
                  onSuccess: () => setDeleteTarget(null),
                });
              }}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
