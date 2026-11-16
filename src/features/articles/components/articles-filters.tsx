"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon } from "lucide-react";
import {
  articlesFiltersSchema,
  type ArticlesFiltersValues,
} from "@/features/articles/schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ArticlesFiltersProps = {
  values: ArticlesFiltersValues;
  onChange: (values: ArticlesFiltersValues) => void;
};

export function ArticlesFilters({ values, onChange }: ArticlesFiltersProps) {
  const { control, register, watch } = useForm<ArticlesFiltersValues>({
    resolver: zodResolver(articlesFiltersSchema),
    defaultValues: values,
  });

  useEffect(() => {
    const subscription = watch((formValues) => {
      const parsed = articlesFiltersSchema.safeParse(formValues);
      if (parsed.success) {
        onChange(parsed.data);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <form className="grid gap-3 rounded-2xl border border-border/70 bg-card/60 p-3 backdrop-blur-sm sm:grid-cols-[minmax(0,1fr)_13rem]">
      <div className="grid gap-1.5">
        <Label htmlFor="articles-search">Search</Label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="articles-search"
            className="pl-8"
            placeholder="Title, excerpt, or slug..."
            {...register("search")}
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="articles-status">Status</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                if (value) field.onChange(value);
              }}
            >
              <SelectTrigger id="articles-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </form>
  );
}
