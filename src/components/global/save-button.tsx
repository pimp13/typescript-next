"use client";

import { useEffect, useState, type ComponentProps, type ReactNode } from "react";
import {
  CheckIcon,
  Loader2Icon,
  XIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

export type SaveButtonStatus = "idle" | "success" | "error";

type ButtonProps = ComponentProps<typeof Button>;

export type SaveButtonProps = Omit<ButtonProps, "children"> & {
  /** Idle label (e.g. "Save profile", "Create user"). */
  children: ReactNode;
  /** Mutation / request in flight. */
  isPending?: boolean;
  /** Brief success/error flash after a request. */
  status?: SaveButtonStatus;
  /** Default action icon when idle. */
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loadingText?: string;
  successText?: string;
  errorText?: string;
  successIcon?: LucideIcon;
  errorIcon?: LucideIcon;
  /** Auto-clear local flash after this many ms (0 = never). */
  statusResetMs?: number;
  onStatusReset?: () => void;
};

export function SaveButton({
  children,
  isPending = false,
  status = "idle",
  className,
  icon: IdleIcon,
  iconPosition = "left",
  disabled,
  type = "submit",
  loadingText = "Saving...",
  successText = "Saved",
  errorText = "Failed",
  successIcon: SuccessIcon = CheckIcon,
  errorIcon: ErrorIcon = XIcon,
  statusResetMs = 1800,
  onStatusReset,
  ...props
}: SaveButtonProps) {
  const [flash, setFlash] = useState<SaveButtonStatus>("idle");

  useEffect(() => {
    if (status === "idle" || isPending) {
      setFlash("idle");
      return;
    }

    setFlash(status);
    if (statusResetMs <= 0) return;

    const timer = window.setTimeout(() => {
      setFlash("idle");
      onStatusReset?.();
    }, statusResetMs);

    return () => window.clearTimeout(timer);
  }, [status, isPending, statusResetMs, onStatusReset]);

  const phase: "pending" | SaveButtonStatus = isPending
    ? "pending"
    : flash !== "idle"
      ? flash
      : "idle";

  const label =
    phase === "pending"
      ? loadingText
      : phase === "success"
        ? successText
        : phase === "error"
          ? errorText
          : children;

  const Icon =
    phase === "pending"
      ? Loader2Icon
      : phase === "success"
        ? SuccessIcon
        : phase === "error"
          ? ErrorIcon
          : IdleIcon;

  const iconDataSlot =
    iconPosition === "right" ? "inline-end" : "inline-start";

  return (
    <Button
      type={type}
      disabled={disabled || isPending}
      aria-busy={isPending || undefined}
      data-status={phase}
      className={cn(
        phase === "success" &&
        "bg-emerald-600 text-white hover:bg-emerald-600/90",
        phase === "error" && "bg-destructive text-white hover:bg-destructive/90",
        className,
      )}
      {...props}
    >
      {Icon && iconPosition === "left" ? (
        <Icon
          data-icon={iconDataSlot}
          className={cn(phase === "pending" && "animate-spin")}
        />
      ) : null}
      <span>{label}</span>
      {Icon && iconPosition === "right" ? (
        <Icon
          data-icon={iconDataSlot}
          className={cn(phase === "pending" && "animate-spin")}
        />
      ) : null}
    </Button>
  );
}
