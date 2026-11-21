"use client";

import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import {
  AtSignIcon,
  CalendarIcon,
  CopyIcon,
  ShieldIcon,
} from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { ProfileSettings } from "@/features/profile/components/profile-settings";
import { usePublicProfile } from "@/features/profile/hooks/use-profile";
import {
  profileDisplayName,
  profileHandle,
  profilePath,
} from "@/features/profile/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type ProfilePageProps = {
  handle: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProfilePage({ handle }: ProfilePageProps) {
  const router = useRouter();
  const profileQuery = usePublicProfile(handle);
  const { data: currentUser, isLoading: authLoading } = useCurrentUser();

  if (profileQuery.isLoading || authLoading) {
    return (
      <div className="grid gap-6">
        <Skeleton className="h-48 w-full rounded-[2rem]" />
        <Skeleton className="h-72 w-full rounded-3xl" />
      </div>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    const notFound =
      profileQuery.error instanceof ApiError &&
      profileQuery.error.status === 404;

    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-border/70 px-6 py-14 text-center">
        <p className="text-lg font-semibold tracking-tight">
          {notFound ? "Profile not found" : "Could not load profile"}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {notFound
            ? "This @handle does not match an active Funlife account."
            : "Check that the Go API is available and try again."}
        </p>
      </div>
    );
  }

  const profile = profileQuery.data;
  const displayName = profileDisplayName(profile);
  const handleLabel = profileHandle(profile);
  const isOwner = currentUser?.id === profile.id;
  const joined = (() => {
    try {
      return format(parseISO(profile.created_at), "MMMM yyyy");
    } catch {
      return null;
    }
  })();

  return (
    <div className="grid gap-6 lg:gap-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.93_0.05_95),transparent_42%),linear-gradient(145deg,oklch(0.97_0.02_170),oklch(0.94_0.03_95))] dark:bg-[radial-gradient(circle_at_top_right,oklch(0.32_0.05_95),transparent_40%),linear-gradient(145deg,oklch(0.22_0.03_170),oklch(0.18_0.03_95))]" />
        <div className="relative grid gap-6 p-6 sm:p-8 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-end">
          <Avatar className="size-24 rounded-3xl border border-border/60 bg-background/80 shadow-sm sm:size-28">
            {profile.avatar ? (
              <AvatarImage src={profile.avatar} alt={displayName} />
            ) : null}
            <AvatarFallback className="rounded-3xl text-2xl">
              {initials(displayName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                Profile
              </p>
              <h1 className="truncate text-3xl font-semibold tracking-tight sm:text-4xl">
                {displayName}
              </h1>
              <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <AtSignIcon className="size-3.5" />
                {handleLabel}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{profile.role_name || profile.role}</Badge>
              <Badge
                variant={
                  profile.status === "active"
                    ? "success"
                    : profile.status === "banned"
                      ? "destructive"
                      : "warning"
                }
              >
                {profile.status}
              </Badge>
              {joined ? (
                <Badge variant="outline">
                  <CalendarIcon className="size-3" />
                  Joined {joined}
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const url = `${window.location.origin}${profilePath(profile)}`;
                try {
                  await navigator.clipboard.writeText(url);
                  toast.success("Profile link copied");
                } catch {
                  toast.error("Could not copy link");
                }
              }}
            >
              <CopyIcon data-icon="inline-start" />
              Copy link
            </Button>
            {isOwner ? (
              <Badge variant="outline" className="h-8 px-3">
                <ShieldIcon className="size-3.5" />
                Your account
              </Badge>
            ) : null}
          </div>
        </div>
      </section>

      {isOwner && currentUser ? (
        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Manage profile
            </h2>
            <p className="text-sm text-muted-foreground">
              Update how you appear across Funlife and secure your account.
            </p>
          </div>
          <ProfileSettings
            user={currentUser}
            onUsernameChanged={(nextPath) => {
              router.replace(nextPath);
            }}
          />
        </section>
      ) : (
        <section className="rounded-3xl border border-dashed border-border/80 px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            This is a public Funlife profile. Sign in as this account to manage
            settings.
          </p>
        </section>
      )}
    </div>
  );
}
