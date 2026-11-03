"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormValues,
  type UpdateUserFormValues,
} from "@/features/users/schemas";
import type { ManagedUser } from "@/features/users/types";
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

type UserFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  user?: ManagedUser | null;
  pending?: boolean;
  onSubmitCreate: (values: CreateUserFormValues) => void;
  onSubmitUpdate: (values: {
    name: string;
    email: string;
    role: "USER" | "SUPER_ADMIN";
    password?: string;
  }) => void;
};

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

  const createForm = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
    },
  });

  const editForm = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (isEdit && user) {
      editForm.reset({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
      return;
    }

    createForm.reset({
      name: "",
      email: "",
      password: "",
      role: "USER",
    });
  }, [open, isEdit, user, createForm, editForm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit user" : "Create user"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update profile, role, or optionally reset the password."
              : "Add a new account. Super admins can manage all users."}
          </DialogDescription>
        </DialogHeader>

        {isEdit ? (
          <form
            className="grid gap-4"
            onSubmit={editForm.handleSubmit((values) => {
              onSubmitUpdate({
                name: values.name,
                email: values.email,
                role: values.role,
                ...(values.password ? { password: values.password } : {}),
              });
            })}
          >
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" {...editForm.register("name")} />
              {editForm.formState.errors.name ? (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.name.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" {...editForm.register("email")} />
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

            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Controller
                control={editForm.control}
                name="role"
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
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="SUPER_ADMIN">Super admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
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
                {pending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form
            className="grid gap-4"
            onSubmit={createForm.handleSubmit(onSubmitCreate)}
          >
            <div className="grid gap-2">
              <Label htmlFor="create-name">Name</Label>
              <Input id="create-name" {...createForm.register("name")} />
              {createForm.formState.errors.name ? (
                <p className="text-sm text-destructive">
                  {createForm.formState.errors.name.message}
                </p>
              ) : null}
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
                name="role"
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
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="SUPER_ADMIN">Super admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
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
                {pending ? "Creating..." : "Create user"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
