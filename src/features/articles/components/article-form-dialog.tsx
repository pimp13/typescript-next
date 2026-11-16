"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SparklesIcon, WrenchIcon } from "lucide-react";
import {
  articleFormSchema,
  type ArticleFormValues,
} from "@/features/articles/schemas";
import {
  normalizeSlugInput,
  slugify,
} from "@/features/articles/lib/slugify";
import type { Article } from "@/features/articles/types";
import { cn } from "cn";
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
import { RichTextEditor } from "@/components/editor";

type ArticleFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  article?: Article | null;
  pending?: boolean;
  onSubmit: (values: ArticleFormValues) => void;
};

type SlugMode = "auto" | "manual";

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
  const [slugMode, setSlugMode] = useState<SlugMode>("auto");

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: emptyValues,
  });

  const titleValue = useWatch({ control: form.control, name: "title" });
  const slugValue = useWatch({ control: form.control, name: "slug" });

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
      setSlugMode("manual");
      return;
    }

    form.reset(emptyValues);
    setSlugMode("auto");
  }, [open, isEdit, article, form]);

  useEffect(() => {
    if (!open || slugMode !== "auto") return;
    form.setValue("slug", slugify(titleValue ?? ""), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [open, slugMode, titleValue, form]);

  const switchSlugMode = (next: SlugMode) => {
    setSlugMode(next);
    if (next === "auto") {
      form.setValue("slug", slugify(form.getValues("title") ?? ""), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-3xl"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit article" : "Create article"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update content, cover, or publish state."
              : "Draft a new piece. Author is taken from your signed-in Go session."}
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
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

            <div className="grid gap-2 sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="article-slug">Slug</Label>
                <div
                  role="group"
                  aria-label="Slug mode"
                  className="inline-flex rounded-lg border border-border/70 bg-muted/50 p-0.5"
                >
                  <button
                    type="button"
                    onClick={() => switchSlugMode("auto")}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition",
                      slugMode === "auto"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <SparklesIcon className="size-3" />
                    Auto
                  </button>
                  <button
                    type="button"
                    onClick={() => switchSlugMode("manual")}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition",
                      slugMode === "manual"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <WrenchIcon className="size-3" />
                    Manual
                  </button>
                </div>
              </div>

              <Input
                id="article-slug"
                readOnly={slugMode === "auto"}
                placeholder={
                  slugMode === "auto"
                    ? "generated-from-title"
                    : "my-custom-slug"
                }
                className={cn(
                  "font-mono text-sm",
                  slugMode === "auto" && "bg-muted/40 text-muted-foreground",
                )}
                value={slugValue ?? ""}
                onChange={(event) => {
                  if (slugMode !== "manual") return;
                  form.setValue("slug", normalizeSlugInput(event.target.value), {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
              <p className="text-xs text-muted-foreground">
                {slugMode === "auto"
                  ? "Slug updates from the title; spaces become hyphens."
                  : "Type freely — spaces are converted to hyphens as you type."}
              </p>
              {form.formState.errors.slug ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.slug.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-2 sm:col-span-2 sm:max-w-xs">
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
            <Controller
              control={form.control}
              name="content"
              render={({ field }) => (
                <RichTextEditor
                  id="article-content"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Write the article body…"
                  minHeight="16rem"
                  aria-invalid={Boolean(form.formState.errors.content)}
                  disabled={pending}
                />
              )}
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
