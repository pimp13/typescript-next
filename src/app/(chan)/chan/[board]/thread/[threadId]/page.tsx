import { ThreadView } from "@/features/chan/components/thread-view";

export const instant = false;

type ThreadPageProps = {
  params: Promise<{ board: string; threadId: string }>;
};

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { board, threadId } = await params;
  return <ThreadView slug={board} threadId={threadId} />;
}
