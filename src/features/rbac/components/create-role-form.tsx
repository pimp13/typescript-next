"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createRoleSchema,
  type CreateRoleFormValues,
} from "@/features/rbac/schemas";
import { useCreateRole } from "@/features/rbac/hooks/use-rbac";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ResponsiveModalActions,
} from "@/components/responsive-modal";

type CreateRoleFormProps = {
  onClose: () => void;
};

function slugifyName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 50);
}

export function CreateRoleForm({ onClose }: CreateRoleFormProps) {
  const createMutation = useCreateRole();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      slug: "",
      name: "",
      description: "",
    },
  });

  const nameValue = watch("name");
  const slugValue = watch("slug");

  return (
    <form
      className="grid gap-4"
      onSubmit={handleSubmit(async (values) => {
        await createMutation.mutateAsync({
          slug: values.slug,
          name: values.name,
          description: values.description || undefined,
        });
        onClose();
      })}
    >
      <div className="grid gap-2">
        <Label htmlFor="role-name">Name</Label>
        <Input
          id="role-name"
          placeholder="Content editor"
          aria-invalid={Boolean(errors.name)}
          {...register("name", {
            onChange: (event) => {
              const next = event.target.value as string;
              if (!slugValue || slugValue === slugifyName(nameValue)) {
                setValue("slug", slugifyName(next), { shouldValidate: true });
              }
            },
          })}
        />
        {errors.name ? (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role-slug">Slug</Label>
        <Input
          id="role-slug"
          placeholder="content_editor"
          aria-invalid={Boolean(errors.slug)}
          {...register("slug")}
        />
        {errors.slug ? (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Lowercase identifier used by the Go RBAC API.
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role-description">Description</Label>
        <Textarea
          id="role-description"
          rows={3}
          placeholder="Optional short description"
          {...register("description")}
        />
      </div>

      <ResponsiveModalActions>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={createMutation.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating..." : "Create role"}
        </Button>
      </ResponsiveModalActions>
    </form>
  );
}
