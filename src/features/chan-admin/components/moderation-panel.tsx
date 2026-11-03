"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ApiError } from "@/lib/api";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import {
  useAdminBans,
  useAdminPosts,
  useAdminThreads,
  useCreateBan,
  useDeactivateBan,
  useDeletePostAdmin,
  useDeleteThreadAdmin,
  useModerateThread,
} from "@/features/chan-admin/hooks/use-chan-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const adminRoles = new Set(["SUPER_ADMIN", "ADMIN_GENERAL"]);

export function ModerationPanel() {
  const router = useRouter();
  const { data: user, isLoading: authLoading, isError, error } = useCurrentUser();
  const threadsQuery = useAdminThreads();
  const postsQuery = useAdminPosts();
  const bansQuery = useAdminBans();
  const moderateMutation = useModerateThread();
  const deleteThreadMutation = useDeleteThreadAdmin();
  const deletePostMutation = useDeletePostAdmin();
  const createBanMutation = useCreateBan();
  const deactivateBanMutation = useDeactivateBan();
  const [banReason, setBanReason] = useState("Spam / abuse");

  useEffect(() => {
    if (isError && error instanceof ApiError && error.status === 401) {
      router.replace("/login");
    }
  }, [error, isError, router]);

  useEffect(() => {
    if (!authLoading && user && !adminRoles.has(user.role)) {
      router.replace("/dashboard");
    }
  }, [authLoading, router, user]);

  if (authLoading || !user || !adminRoles.has(user.role)) {
    return <Skeleton className="h-80 w-full rounded-2xl" />;
  }

  return (
    <div className="grid gap-6">
      <section className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Moderation</h2>
        <p className="text-sm text-muted-foreground">
          Moderate threads, delete posts, and manage bans.
        </p>
      </section>

      <div className="grid gap-2 sm:max-w-md">
        <Label htmlFor="ban-reason">Default ban reason</Label>
        <Input
          id="ban-reason"
          value={banReason}
          onChange={(event) => setBanReason(event.target.value)}
        />
      </div>

      <Tabs defaultValue="threads">
        <TabsList>
          <TabsTrigger value="threads">Threads</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="bans">Bans</TabsTrigger>
        </TabsList>

        <TabsContent value="threads" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border/70">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thread</TableHead>
                  <TableHead>Flags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(threadsQuery.data ?? []).map((thread) => (
                  <TableRow key={thread.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <Link
                          href={`/chan/${thread.board.slug}/thread/${thread.id}`}
                          className="font-medium hover:underline"
                        >
                          /{thread.board.slug}/ ·{" "}
                          {thread.subject || thread.posts[0]?.comment.slice(0, 60) || thread.id}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {thread.replyCount} replies · bumped{" "}
                          {format(parseISO(thread.bumpedAt), "MMM d HH:mm")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {thread.isSticky ? <Badge>Sticky</Badge> : null}
                        {thread.isLocked ? <Badge variant="outline">Locked</Badge> : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex flex-wrap justify-end gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            moderateMutation.mutate({
                              id: thread.id,
                              body: { isSticky: !thread.isSticky },
                            })
                          }
                        >
                          {thread.isSticky ? "Unsticky" : "Sticky"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            moderateMutation.mutate({
                              id: thread.id,
                              body: { isLocked: !thread.isLocked },
                            })
                          }
                        >
                          {thread.isLocked ? "Unlock" : "Lock"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteThreadMutation.mutate(thread.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="posts" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border/70">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post</TableHead>
                  <TableHead>Meta</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(postsQuery.data ?? []).map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">
                          /{post.board.slug}/ No.{post.number}
                        </p>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {post.comment || "[image only]"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {post.name}
                      {post.tripcode ? ` !${post.tripcode}` : ""} ·{" "}
                      {format(parseISO(post.createdAt), "MMM d HH:mm")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex flex-wrap justify-end gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          render={
                            <Link
                              href={`/chan/${post.board.slug}/thread/${post.thread.id}#p${post.number}`}
                            />
                          }
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            createBanMutation.mutate({
                              postId: post.id,
                              reason: banReason,
                            })
                          }
                        >
                          Ban IP
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deletePostMutation.mutate(post.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="bans" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border/70">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ban</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(bansQuery.data ?? []).map((ban) => (
                  <TableRow key={ban.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-mono text-xs">{ban.ipHash.slice(0, 18)}…</p>
                        <p className="text-sm">{ban.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          by {ban.createdBy?.name ?? "system"} ·{" "}
                          {format(parseISO(ban.createdAt), "MMM d yyyy HH:mm")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ban.isActive ? "destructive" : "secondary"}>
                        {ban.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {ban.isActive ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deactivateBanMutation.mutate(ban.id)}
                        >
                          Lift ban
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
