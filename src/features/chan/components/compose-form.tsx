"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const composeSchema = z.object({
  name: z.string().max(48).optional(),
  email: z.string().max(64).optional(),
  subject: z.string().max(120).optional(),
  comment: z.string().max(4000),
  spoiler: z.boolean(),
});

type ComposeValues = z.infer<typeof composeSchema>;

type ComposeFormProps = {
  mode: "thread" | "reply";
  forceImage?: boolean;
  pending?: boolean;
  initialComment?: string;
  onSubmit: (formData: FormData) => void;
};

export function ComposeForm({
  mode,
  forceImage = false,
  pending = false,
  initialComment = "",
  onSubmit,
}: ComposeFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ComposeValues>({
    resolver: zodResolver(composeSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      comment: initialComment,
      spoiler: false,
    },
  });

  const spoiler = watch("spoiler");

  return (
    <form
      className="grid gap-3 rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm"
      onSubmit={handleSubmit((values, event) => {
        const nativeEvent = event?.nativeEvent as
          | (Event & { submitter?: HTMLElement })
          | undefined;
        const form = (nativeEvent?.target as HTMLFormElement | undefined) ?? null;
        const fileInput = form?.elements.namedItem("file") as HTMLInputElement | null;
        const file = fileInput?.files?.[0];

        if (mode === "thread" && forceImage && !file) {
          return;
        }

        if (!values.comment.trim() && !file) {
          return;
        }

        const formData = new FormData();
        if (values.name?.trim()) formData.set("name", values.name.trim());
        if (values.email?.trim()) formData.set("email", values.email.trim());
        if (mode === "thread" && values.subject?.trim()) {
          formData.set("subject", values.subject.trim());
        }
        formData.set("comment", values.comment.trim());
        formData.set("spoiler", values.spoiler ? "true" : "false");
        if (file) formData.set("file", file);

        onSubmit(formData);
        reset({
          name: values.name,
          email: "",
          subject: "",
          comment: "",
          spoiler: false,
        });
        if (fileInput) fileInput.value = "";
      })}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">
            {mode === "thread" ? "Start a thread" : "Reply"}
          </h3>
          <p className="text-xs text-muted-foreground">
            Leave name blank for Anonymous. Use <code>name#trip</code> for a tripcode. Email{" "}
            <code>sage</code> to avoid bumping.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Anonymous" {...register("name")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Options</Label>
          <Input id="email" placeholder="sage" {...register("email")} />
        </div>
      </div>

      {mode === "thread" ? (
        <div className="grid gap-1.5">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" placeholder="Optional subject" {...register("subject")} />
        </div>
      ) : null}

      <div className="grid gap-1.5">
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          rows={5}
          placeholder="Say something. Quote with >>123"
          {...register("comment")}
        />
        {errors.comment ? (
          <p className="text-sm text-destructive">{errors.comment.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-1.5">
          <Label htmlFor="file" className="inline-flex items-center gap-2">
            <ImageIcon className="size-4" />
            Image {forceImage && mode === "thread" ? "(required)" : "(optional)"}
          </Label>
          <Input id="file" name="file" type="file" accept="image/jpeg,image/png,image/gif,image/webp" />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={spoiler}
            onCheckedChange={(checked) => setValue("spoiler", Boolean(checked))}
          />
          <Label>Spoiler image</Label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending
            ? mode === "thread"
              ? "Creating..."
              : "Posting..."
            : mode === "thread"
              ? "Create thread"
              : "Post reply"}
        </Button>
      </div>
    </form>
  );
}
