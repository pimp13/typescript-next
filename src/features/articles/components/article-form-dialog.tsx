"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  articleFormSchema,
  type ArticleFormValues,
} from "@/features/articles/schemas";
import type { Article } from "@/features/articles/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ArticleFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  article?: Article | null;
  pending?: boolean;
  onSubmit: (values: ArticleFormValues) => void;
};

const emptyValues: ArticleFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  status: "draft",
};

export function ArticleFormDialog({
  open,
  onOpenChange,
  mode,
  article,
  pending = false,
  onSubmit,
}: ArticleFormDialogProps) {
  const isEdit = mode === "edit";
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;

    if (isEdit && article) {
      form.reset({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        cover_image: article.cover_image ?? "",
        status: article.status,
      });
      return;
    }

    form.reset(emptyValues);
  }, [open, isEdit, article, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl" showCloseButton>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit article" : "Create article"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update content, cover, or publish state."
              : "Draft a new piece. Author is taken from your signed-in Go session."}
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="article-title">Title</Label>
              <Input id="article-title" {...form.register("title")} />
              {form.formState.errors.title ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.title.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="article-slug">Slug</Label>
              <Input
                id="article-slug"
                placeholder="auto from title"
                {...form.register("slug")}
              />
              {form.formState.errors.slug ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.slug.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="article-status">Status</Label>
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) field.onChange(value);
                    }}
                  >
                    <SelectTrigger id="article-status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="article-cover">Cover image URL</Label>
            <Input
              id="article-cover"
              placeholder="https://..."
              {...form.register("cover_image")}
            />
            {form.formState.errors.cover_image ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.cover_image.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="article-excerpt">Excerpt</Label>
            <Textarea
              id="article-excerpt"
              rows={2}
              {...form.register("excerpt")}
            />
            {form.formState.errors.excerpt ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.excerpt.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="article-content">Content</Label>
            <Textarea
              id="article-content"
              rows={8}
              className="min-h-40 font-mono text-sm"
              {...form.register("content")}
            />
            {form.formState.errors.content ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.content.message}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                  ? "Save changes"
                  : "Create article"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
