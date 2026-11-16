"use client";

import { cn } from "cn";
import { normalizeEditorValue } from "@/components/editor/editor-utils";

type RichTextContentProps = {
  value?: string | null;
  className?: string;
};

/** Read-only renderer for TipTap HTML (articles, comments, etc.). */
export function RichTextContent({ value, className }: RichTextContentProps) {
  const html = normalizeEditorValue(value);

  if (!html) {
    return null;
  }

  return (
    <div
      data-slot="rich-text-content"
      className={cn("rich-text-editor-content", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
