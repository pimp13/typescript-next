"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import { cn } from "cn";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import {
  normalizeEditorValue,
  toEditorHtml,
} from "@/components/editor/editor-utils";

export type RichTextEditorProps = {
  value?: string;
  onChange?: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  /** Show formatting toolbar (default true). */
  toolbar?: boolean;
  /** Minimum editor height, e.g. "12rem" or 220. */
  minHeight?: string | number;
  className?: string;
  editorClassName?: string;
  id?: string;
  "aria-invalid"?: boolean;
};

export function RichTextEditor({
  value = "",
  onChange,
  onBlur,
  placeholder = "Start writing…",
  disabled = false,
  toolbar = true,
  minHeight = "14rem",
  className,
  editorClassName,
  id,
  "aria-invalid": ariaInvalid,
}: RichTextEditorProps) {
  const resolvedMinHeight =
    typeof minHeight === "number" ? `${minHeight}px` : minHeight;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-2",
          rel: "noopener noreferrer nofollow",
        },
      }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-xl border border-border/60 max-w-full h-auto",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: normalizeEditorValue(value),
    editable: !disabled,
    editorProps: {
      attributes: {
        id: id ?? "",
        class: cn(
          "rich-text-editor-content focus:outline-none",
          editorClassName,
        ),
        style: `min-height: ${resolvedMinHeight}`,
        ...(ariaInvalid ? { "aria-invalid": "true" } : {}),
      },
    },
    onUpdate: ({ editor: current }) => {
      onChange?.(toEditorHtml(current));
    },
    onBlur: () => {
      onBlur?.();
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor) return;
    if (toEditorHtml(editor) === (value ?? "").trim()) return;
    editor.commands.setContent(normalizeEditorValue(value), {
      emitUpdate: false,
    });
  }, [editor, value]);

  return (
    <div
      data-slot="rich-text-editor"
      data-disabled={disabled || undefined}
      className={cn(
        "overflow-hidden rounded-xl border border-input bg-transparent transition-colors",
        "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "dark:bg-input/30",
        disabled && "pointer-events-none opacity-60",
        ariaInvalid && "border-destructive",
        className,
      )}
    >
      {toolbar ? <EditorToolbar editor={editor} disabled={disabled} /> : null}
      <div className="px-3 py-2.5 sm:px-4 sm:py-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
