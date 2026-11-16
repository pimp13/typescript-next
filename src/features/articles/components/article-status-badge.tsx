import type { ArticleStatus } from "@/features/articles/types";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<
  ArticleStatus,
  { label: string; variant: "secondary" | "success" | "warning" }
> = {
  draft: { label: "Draft", variant: "secondary" },
  published: { label: "Published", variant: "success" },
  archived: { label: "Archived", variant: "warning" },
};

export function ArticleStatusBadge({ status }: { status: ArticleStatus }) {
  const config = statusConfig[status] ?? statusConfig.draft;

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
