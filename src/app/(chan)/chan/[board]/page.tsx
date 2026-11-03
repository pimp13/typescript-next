import { BoardView } from "@/features/chan/components/board-view";

export const instant = false;

type BoardPageProps = {
  params: Promise<{ board: string }>;
};

export default async function BoardPage({ params }: BoardPageProps) {
  const { board } = await params;
  return <BoardView slug={board} />;
}
