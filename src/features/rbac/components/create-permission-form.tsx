"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPermissionSchema,
  type CreatePermissionFormValues,
} from "@/features/rbac/schemas";
import { useCreatePermission } from "@/features/rbac/hooks/use-rbac";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResponsiveModalActions } from "@/components/responsive-modal";

type CreatePermissionFormProps = {
  onClose: () => void;
};

export function CreatePermissionForm({ onClose }: CreatePermissionFormProps) {
  const createMutation = useCreatePermission();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreatePermissionFormValues>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: {
      resource: "",
      action: "",
      name: "",
      description: "",
    },
  });

  const resource = watch("resource");
  const action = watch("action");
  const previewCode =
    resource && action ? `${resource}:${action}` : "resource:action";

  return (
    <form
      className="grid gap-4"
      onSubmit={handleSubmit(async (values) => {
        await createMutation.mutateAsync({
          resource: values.resource,
          action: values.action,
          name: values.name || undefined,
          description: values.description || undefined,
        });
        onClose();
      })}
    >
      <div className="rounded-lg border border-border/70 bg-muted/30 px-4 py-3">
        <p className="text-xs text-muted-foreground">Permission code</p>
        <p className="mt-1 font-mono text-sm font-medium tracking-tight">
          {previewCode}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="perm-resource">Resource</Label>
          <Input
            id="perm-resource"
            placeholder="articles"
            aria-invalid={Boolean(errors.resource)}
            {...register("resource")}
          />
          {errors.resource ? (
            <p className="text-sm text-destructive">
              {errors.resource.message}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="perm-action">Action</Label>
          <Input
            id="perm-action"
            placeholder="publish"
            aria-invalid={Boolean(errors.action)}
            {...register("action")}
          />
          {errors.action ? (
            <p className="text-sm text-destructive">{errors.action.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="perm-name">Display name</Label>
        <Input
          id="perm-name"
          placeholder="Publish articles"
          {...register("name")}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="perm-description">Description</Label>
        <Textarea
          id="perm-description"
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
          {createMutation.isPending ? "Creating..." : "Create permission"}
        </Button>
      </ResponsiveModalActions>
    </form>
  );
}
