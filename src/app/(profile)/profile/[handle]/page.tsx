import type { Metadata } from "next";
import { ProfilePage } from "@/features/profile/components/profile-page";

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

export default async function ProfileRoutePage({ params }: ProfileRouteProps) {
  const { handle } = await params;
  return <ProfilePage handle={decodeURIComponent(handle)} />;
}
