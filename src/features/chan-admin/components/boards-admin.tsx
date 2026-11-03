"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ApiError } from "@/lib/api";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import {
  useAdminBoards,
  useCreateBoard,
  useDeleteBoard,
  useUpdateBoard,
} from "@/features/chan-admin/hooks/use-chan-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

const adminRoles = new Set(["SUPER_ADMIN", "ADMIN_GENERAL"]);

const boardSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(16)
    .regex(/^[a-z0-9]+$/, "Lowercase letters/numbers only"),
  title: z.string().min(2).max(80),
  description: z.string().max(500),
  isNsfw: z.boolean(),
  isWorksafe: z.boolean(),
  forceImage: z.boolean(),
  bumpLimit: z.number().min(50).max(1000),
  threadLimit: z.number().min(20).max(500),
  sortOrder: z.number().min(0).max(10000),
});

type BoardFormValues = z.infer<typeof boardSchema>;

export function BoardsAdmin() {
  const router = useRouter();
  const { data: user, isLoading: authLoading, isError, error } = useCurrentUser();
  const boardsQuery = useAdminBoards();
  const createMutation = useCreateBoard();
  const updateMutation = useUpdateBoard();
  const deleteMutation = useDeleteBoard();

  const form = useForm<BoardFormValues>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      slug: "",
      title: "",
      description: "",
      isNsfw: false,
      isWorksafe: true,
      forceImage: false,
      bumpLimit: 300,
      threadLimit: 150,
      sortOrder: 0,
    },
  });

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
        <h2 className="text-2xl font-semibold tracking-tight">Boards</h2>
        <p className="text-sm text-muted-foreground">
          Configure public boards for the imageboard.
        </p>
      </section>

      <form
        className="grid gap-3 rounded-2xl border border-border/70 bg-card/60 p-4 md:grid-cols-2"
        onSubmit={form.handleSubmit((values) => {
          createMutation.mutate(values, {
            onSuccess: () => form.reset(),
          });
        })}
      >
        <div className="grid gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" placeholder="g" {...form.register("slug")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Technology" {...form.register("title")} />
        </div>
        <div className="grid gap-1.5 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} {...form.register("description")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="bumpLimit">Bump limit</Label>
          <Input
            id="bumpLimit"
            type="number"
            {...form.register("bumpLimit", { valueAsNumber: true })}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="threadLimit">Thread limit</Label>
          <Input
            id="threadLimit"
            type="number"
            {...form.register("threadLimit", { valueAsNumber: true })}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input
            id="sortOrder"
            type="number"
            {...form.register("sortOrder", { valueAsNumber: true })}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-6">
          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={form.watch("isNsfw")}
              onCheckedChange={(checked) =>
                form.setValue("isNsfw", Boolean(checked))
              }
            />
            NSFW
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={form.watch("isWorksafe")}
              onCheckedChange={(checked) =>
                form.setValue("isWorksafe", Boolean(checked))
              }
            />
            Worksafe
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={form.watch("forceImage")}
              onCheckedChange={(checked) =>
                form.setValue("forceImage", Boolean(checked))
              }
            />
            Force image
          </label>
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create board"}
          </Button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-border/70">
        {boardsQuery.isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Board</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Limits</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(boardsQuery.data ?? []).map((board) => (
                <TableRow key={board.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">
                        /{board.slug}/ — {board.title}
                      </p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {board.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant={board.isActive ? "success" : "destructive"}>
                        {board.isActive ? "Active" : "Hidden"}
                      </Badge>
                      {board.isNsfw ? <Badge variant="destructive">NSFW</Badge> : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    bump {board.bumpLimit} · threads {board.threadLimit}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateMutation.mutate({
                            id: board.id,
                            body: { isActive: !board.isActive },
                          })
                        }
                      >
                        {board.isActive ? "Hide" : "Show"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(board.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
