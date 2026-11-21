"use client";

import { useId, useRef, useState } from "react";
import { ImageIcon, LinkIcon, Loader2Icon, Trash2Icon, UploadIcon } from "lucide-react";
import { cn } from "cn";
import { mediaURL } from "@/lib/api";
import { uploadFile } from "@/features/uploads/api";
import type { UploadFolder } from "@/features/uploads/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export type MediaFieldProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: UploadFolder;
  accept?: string;
  disabled?: boolean;
  error?: string;
  preview?: "avatar" | "image" | "none";
  placeholder?: string;
  className?: string;
  id?: string;
};

export function MediaField({
  value,
  onChange,
  label = "Media",
  folder = "general",
  accept = "image/jpeg,image/png,image/gif,image/webp",
  disabled = false,
  error,
  preview = "image",
  placeholder = "https://…",
  className,
  id,
}: MediaFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"upload" | "link">(
    value && !value.includes("/uploads/") ? "link" : "upload",
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const previewSrc = mediaURL(value);
  const busy = disabled || uploading;

  async function handleFile(file: File | undefined) {
    if (!file || busy) return;
    setUploadError(null);
    setUploading(true);
    try {
      const response = await uploadFile(file, folder);
      const url = response.data?.url;
      if (!url) {
        throw new Error("Upload succeeded without a URL");
      }
      onChange(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className={cn("grid gap-3", className)}>
      {label ? <Label htmlFor={`${fieldId}-link`}>{label}</Label> : null}

      {(preview === "avatar" || preview === "image") && previewSrc ? (
        <div className="flex items-center gap-3">
          {preview === "avatar" ? (
            <Avatar size="lg">
              <AvatarImage src={previewSrc} alt="" />
              <AvatarFallback>
                <ImageIcon className="size-4" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <img
              src={previewSrc}
              alt=""
              className="h-20 w-20 rounded-lg object-cover ring-1 ring-border"
            />
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={() => {
              onChange("");
              setUploadError(null);
            }}
          >
            <Trash2Icon data-icon="inline-start" />
            Remove
          </Button>
        </div>
      ) : null}

      <Tabs
        value={mode}
        onValueChange={(next) => {
          if (next === "upload" || next === "link") setMode(next);
        }}
      >
        <TabsList className="grid h-auto w-full max-w-xs grid-cols-2">
          <TabsTrigger value="upload" disabled={busy}>
            <UploadIcon className="size-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="link" disabled={busy}>
            <LinkIcon className="size-4" />
            Link
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-3">
          <input
            ref={inputRef}
            id={`${fieldId}-file`}
            type="file"
            accept={accept}
            className="sr-only"
            disabled={busy}
            onChange={(event) => {
              void handleFile(event.target.files?.[0]);
            }}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-foreground/30 bg-muted/30 px-4 py-8 text-sm text-muted-foreground transition-colors",
              "hover:border-foreground/50 hover:bg-muted/50 hover:text-foreground",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            {uploading ? (
              <>
                <Loader2Icon className="size-5 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <UploadIcon className="size-5" />
                Choose an image from your device
              </>
            )}
          </button>
        </TabsContent>

        <TabsContent value="link" className="mt-3">
          <Input
            id={`${fieldId}-link`}
            type="url"
            inputMode="url"
            placeholder={placeholder}
            value={value}
            disabled={busy}
            onChange={(event) => {
              setUploadError(null);
              onChange(event.target.value);
            }}
          />
        </TabsContent>
      </Tabs>

      {uploadError || error ? (
        <p className="text-sm text-destructive">{uploadError || error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Upload a file or paste an image URL.
        </p>
      )}
    </div>
  );
}
