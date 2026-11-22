import type { Metadata } from "next";
import { Suspense } from "react";
import { ProfilePage } from "@/features/profile/components/profile-page";
import { Skeleton } from "@/components/ui/skeleton";

type ProfileRouteProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: ProfileRouteProps): Promise<Metadata> {
  const { handle } = await params;
  const decoded = decodeURIComponent(handle);
  return {
    title: `@${decoded} · Funlife`,
  };
}

function ProfileFallback() {
  return (
    <div className="grid gap-6">
      <Skeleton className="h-48 w-full rounded-[2rem]" />
      <Skeleton className="h-72 w-full rounded-3xl" />
    </div>
  );
}

async function ProfileRouteContent({ params }: ProfileRouteProps) {
  const { handle } = await params;
  return <ProfilePage handle={decodeURIComponent(handle)} />;
}

export default function ProfileRoutePage({ params }: ProfileRouteProps) {
  return (
    <Suspense fallback={<ProfileFallback />}>
      <ProfileRouteContent params={params} />
    </Suspense>
  );
}
