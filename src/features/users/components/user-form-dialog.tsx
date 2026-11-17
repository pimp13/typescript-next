"use client";

import { useEffect, useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormValues,
  type UpdateUserFormValues,
} from "@/features/users/schemas";
import type { ManagedUser } from "@/features/users/types";
import {
  ResponsiveModal,
  ResponsiveModalActions,
} from "@/components/responsive-modal";
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

type UserFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  user?: ManagedUser | null;
  pending?: boolean;
  onSubmitCreate: (values: CreateUserFormValues) => void;
  onSubmitUpdate: (values: UpdateUserFormValues) => void;
};

const roleOptions = [
  { value: "user", label: "User" },
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super admin" },
] as const;

export function UserFormDialog({
  open,
  onOpenChange,
  mode,
  user,
  pending = false,
  onSubmitCreate,
  onSubmitUpdate,
}: UserFormDialogProps) {
  const isEdit = mode === "edit";
  const formId = useId();

  const createForm = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role_slug: "user",
    },
  });

  const editForm = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role_slug: "user",
      status: "active",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (isEdit && user) {
      const slug = (user.role?.slug || "user") as UpdateUserFormValues["role_slug"];
      const status = (
        ["active", "inactive", "banned"].includes(user.status)
          ? user.status
          : "active"
      ) as UpdateUserFormValues["status"];

      editForm.reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: "",
        role_slug: slug,
        status,
      });
      return;
    }

    createForm.reset({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role_slug: "user",
    });
  }, [open, isEdit, user, createForm, editForm]);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={isEdit ? "Edit user" : "Create user"}
      description={
        isEdit
          ? "Update profile, role, status, or optionally reset the password."
          : "Add a new account through the Go users API."
      }
      footer={
        <ResponsiveModalActions>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form={formId} disabled={pending}>
            {pending
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
                ? "Save changes"
                : "Create user"}
          </Button>
        </ResponsiveModalActions>
      }
    >
      {isEdit ? (
        <form
          id={formId}
          className="grid gap-4"
          onSubmit={editForm.handleSubmit(onSubmitUpdate)}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-first-name">First name</Label>
              <Input
                id="edit-first-name"
                {...editForm.register("first_name")}
              />
              {editForm.formState.errors.first_name ? (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.first_name.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-last-name">Last name</Label>
              <Input id="edit-last-name" {...editForm.register("last_name")} />
              {editForm.formState.errors.last_name ? (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.last_name.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              {...editForm.register("email")}
            />
            {editForm.formState.errors.email ? (
              <p className="text-sm text-destructive">
                {editForm.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-password">Password</Label>
            <Input
              id="edit-password"
              type="password"
              placeholder="Leave blank to keep current"
              {...editForm.register("password")}
            />
            {editForm.formState.errors.password ? (
              <p className="text-sm text-destructive">
                {editForm.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Controller
                control={editForm.control}
                name="role_slug"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) field.onChange(value);
                    }}
                  >
                    <SelectTrigger id="edit-role" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Controller
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) field.onChange(value);
                    }}
                  >
                    <SelectTrigger id="edit-status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </form>
      ) : (
        <form
          id={formId}
          className="grid gap-4"
          onSubmit={createForm.handleSubmit(onSubmitCreate)}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="create-first-name">First name</Label>
              <Input
                id="create-first-name"
                {...createForm.register("first_name")}
              />
              {createForm.formState.errors.first_name ? (
                <p className="text-sm text-destructive">
                  {createForm.formState.errors.first_name.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-last-name">Last name</Label>
              <Input
                id="create-last-name"
                {...createForm.register("last_name")}
              />
              {createForm.formState.errors.last_name ? (
                <p className="text-sm text-destructive">
                  {createForm.formState.errors.last_name.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="create-email">Email</Label>
            <Input
              id="create-email"
              type="email"
              {...createForm.register("email")}
            />
            {createForm.formState.errors.email ? (
              <p className="text-sm text-destructive">
                {createForm.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="create-password">Password</Label>
            <Input
              id="create-password"
              type="password"
              {...createForm.register("password")}
            />
            {createForm.formState.errors.password ? (
              <p className="text-sm text-destructive">
                {createForm.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="create-role">Role</Label>
            <Controller
              control={createForm.control}
              name="role_slug"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) field.onChange(value);
                  }}
                >
                  <SelectTrigger id="create-role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </form>
      )}
    </ResponsiveModal>
  );
}
