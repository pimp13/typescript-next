"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRoundIcon, SaveIcon, UserRoundIcon } from "lucide-react";
import type { User } from "@/features/auth/types";
import {
  useChangePassword,
  useUpdateProfile,
} from "@/features/profile/hooks/use-profile";
import {
  changePasswordSchema,
  updateProfileSchema,
  type ChangePasswordFormValues,
  type UpdateProfileFormValues,
} from "@/features/profile/schemas";
import { profilePath } from "@/features/profile/types";
import { MediaField } from "@/components/media-field";
import { SaveButton } from "@/components/global/save-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type ProfileSettingsProps = {
  user: User;
  onUsernameChanged?: (nextPath: string) => void;
};

export function ProfileSettings({
  user,
  onUsernameChanged,
}: ProfileSettingsProps) {
  const updateMutation = useUpdateProfile();
  const passwordMutation = useChangePassword();

  const profileForm = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      first_name: user.firstName ?? "",
      last_name: user.lastName ?? "",
      username: user.username ?? "",
      phone: user.phone ?? "",
      avatar: user.avatar ?? "",
    },
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    profileForm.reset({
      first_name: user.firstName ?? "",
      last_name: user.lastName ?? "",
      username: user.username ?? "",
      phone: user.phone ?? "",
      avatar: user.avatar ?? "",
    });
  }, [user, profileForm]);

  return (
    <div className="rounded-3xl border border-border/70 bg-card/70 p-5 sm:p-6">
      <Tabs defaultValue="profile">
        <TabsList className="grid h-auto w-full max-w-md grid-cols-2">
          <TabsTrigger value="profile">
            <UserRoundIcon className="size-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <KeyRoundIcon className="size-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <form
            className="grid gap-4"
            onSubmit={profileForm.handleSubmit((values) => {
              const previousPath = profilePath(user);
              updateMutation.mutate(
                {
                  first_name: values.first_name.trim(),
                  last_name: values.last_name.trim(),
                  username: values.username.trim() || undefined,
                  phone: values.phone?.trim() || undefined,
                  avatar: values.avatar.trim() || undefined,
                },
                {
                  onSuccess: (response) => {
                    const next = response.data;
                    if (!next || !onUsernameChanged) return;
                    const nextPath = profilePath(next);
                    if (nextPath !== previousPath) {
                      onUsernameChanged(nextPath);
                    }
                  },
                },
              );
            })}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="profile-first-name">First name</Label>
                <Input
                  id="profile-first-name"
                  {...profileForm.register("first_name")}
                />
                {profileForm.formState.errors.first_name ? (
                  <p className="text-sm text-destructive">
                    {profileForm.formState.errors.first_name.message}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="profile-last-name">Last name</Label>
                <Input
                  id="profile-last-name"
                  {...profileForm.register("last_name")}
                />
                {profileForm.formState.errors.last_name ? (
                  <p className="text-sm text-destructive">
                    {profileForm.formState.errors.last_name.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profile-username">Username</Label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                  @
                </span>
                <Input
                  id="profile-username"
                  className="pl-7"
                  placeholder="yourname"
                  {...profileForm.register("username")}
                />
              </div>
              {profileForm.formState.errors.username ? (
                <p className="text-sm text-destructive">
                  {profileForm.formState.errors.username.message}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Public URL becomes{" "}
                  <code className="text-[11px]">
                    /@
                    {profileForm.watch("username")?.trim() || user.id}
                  </code>
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profile-phone">Phone</Label>
              <Input
                id="profile-phone"
                placeholder="+98912..."
                {...profileForm.register("phone")}
              />
            </div>

            <MediaField
              id="profile-avatar"
              label="Avatar"
              folder="avatars"
              preview="avatar"
              value={profileForm.watch("avatar")}
              onChange={(url) => {
                profileForm.setValue("avatar", url, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              disabled={updateMutation.isPending}
              error={profileForm.formState.errors.avatar?.message}
            />

            <div className="grid gap-2">
              <Label>Email</Label>
              <Input value={user.email} disabled />
              <p className="text-xs text-muted-foreground">
                Email is managed by auth and cannot be changed here.
              </p>
            </div>

            <div className="flex justify-end">
              <SaveButton
                isPending={updateMutation.isPending}
                icon={SaveIcon}
                loadingText="Saving..."
              >
                Save profile
              </SaveButton>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <form
            className="grid max-w-lg gap-4"
            onSubmit={passwordForm.handleSubmit((values) => {
              passwordMutation.mutate(
                {
                  current_password: values.current_password,
                  new_password: values.new_password,
                },
                {
                  onSuccess: () => passwordForm.reset(),
                },
              );
            })}
          >
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                {...passwordForm.register("current_password")}
              />
              {passwordForm.formState.errors.current_password ? (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.current_password.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register("new_password")}
              />
              {passwordForm.formState.errors.new_password ? (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.new_password.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register("confirm_password")}
              />
              {passwordForm.formState.errors.confirm_password ? (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.confirm_password.message}
                </p>
              ) : null}
            </div>
            <div className="flex justify-end">
              <SaveButton
                isPending={passwordMutation.isPending}
                icon={KeyRoundIcon}
                loadingText="Updating..."
              >
                Change password
              </SaveButton>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
