import { format, parseISO } from "date-fns";

export function formatArticleDate(value: string | null | undefined) {
  if (!value) return null;
  try {
    return format(parseISO(value), "MMM d, yyyy");
  } catch {
    return null;
  }
}
