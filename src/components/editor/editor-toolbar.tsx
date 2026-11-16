"use client";

import type { Editor } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  HighlighterIcon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  Redo2Icon,
  StrikethroughIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type EditorToolbarProps = {
  editor: Editor | null;
  disabled?: boolean;
};

type ToolbarButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={disabled}
            aria-label={label}
            aria-pressed={active}
            onClick={onClick}
            className={cn(
              "size-8 shrink-0 rounded-lg text-muted-foreground",
              active && "bg-accent text-accent-foreground",
            )}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

function ToolbarDivider() {
  return (
    <Separator
      orientation="vertical"
      className="mx-0.5 hidden h-5 sm:block"
    />
  );
}

export function EditorToolbar({ editor, disabled }: EditorToolbarProps) {
  if (!editor) return null;

  const isDisabled = disabled || !editor.isEditable;

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    const trimmed = url.trim();
    if (trimmed === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: trimmed })
      .run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL", "https://");
    if (!url?.trim()) return;
    editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  return (
    <TooltipProvider delay={200}>
      <div className="sticky top-0 z-10 border-b border-border/70 bg-card/90 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-0.5 p-1.5 sm:gap-1 sm:p-2">
          <ToolbarButton
            label="Undo"
            disabled={isDisabled || !editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2Icon className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Redo"
            disabled={isDisabled || !editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2Icon className="size-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            label="Heading 1"
            active={editor.isActive("heading", { level: 1 })}
            disabled={isDisabled}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading1Icon className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Heading 2"
            active={editor.isActive("heading", { level: 2 })}
            disabled={isDisabled}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2Icon className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Heading 3"
            active={editor.isActive("heading", { level: 3 })}
            disabled={isDisabled}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3Icon className="size-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            label="Bold"
            active={editor.isActive("bold")}
            disabled={isDisabled}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <BoldIcon className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            active={editor.isActive("italic")}
            disabled={isDisabled}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <ItalicIcon className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Underline"
            active={editor.isActive("underline")}
            disabled={isDisabled}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Strikethrough"
            active={editor.isActive("strike")}
            disabled={isDisabled}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <StrikethroughIcon className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Highlight"
            active={editor.isActive("highlight")}
            disabled={isDisabled}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            <HighlighterIcon className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Inline code"
            active={editor.isActive("code")}
            disabled={isDisabled}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <CodeIcon className="size-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            label="Bullet list"
            active={editor.isActive("bulletList")}
            disabled={isDisabled}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <ListIcon className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Ordered list"
            active={editor.isActive("orderedList")}
            disabled={isDisabled}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrderedIcon className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Quote"
            active={editor.isActive("blockquote")}
            disabled={isDisabled}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <QuoteIcon className="size-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            label="Align left"
            active={editor.isActive({ textAlign: "left" })}
            disabled={isDisabled}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeftIcon className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Align center"
            active={editor.isActive({ textAlign: "center" })}
            disabled={isDisabled}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenterIcon className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Align right"
            active={editor.isActive({ textAlign: "right" })}
            disabled={isDisabled}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRightIcon className="size-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            label="Link"
            active={editor.isActive("link")}
            disabled={isDisabled}
            onClick={setLink}
          >
            <LinkIcon className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Image"
            disabled={isDisabled}
            onClick={addImage}
          >
            <ImageIcon className="size-4" />
          </ToolbarButton>
        </div>
      </div>
    </TooltipProvider>
  );
}
