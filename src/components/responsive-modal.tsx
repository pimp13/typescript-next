"use client";

import * as React from "react";
import { useMedia } from "react-use";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { XIcon } from "lucide-react";

const sizeClassName = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-3xl",
  full: "sm:max-w-5xl",
} as const;

export type ResponsiveModalSize = keyof typeof sizeClassName;

type ResponsiveModalProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Sticky action area — Cancel / Submit live here. */
  footer?: React.ReactNode;
  size?: ResponsiveModalSize;
  className?: string;
  contentClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  showCloseButton?: boolean;
  /** Media query for desktop dialog mode. */
  desktopQuery?: string;
};

export function ResponsiveModal({
  children,
  open,
  onOpenChange,
  title,
  description,
  footer,
  size = "md",
  className,
  contentClassName,
  bodyClassName,
  footerClassName,
  showCloseButton = true,
  desktopQuery = "(min-width: 1024px)",
}: ResponsiveModalProps) {
  const isDesktop = useMedia(desktopQuery, true);
  const titleId = React.useId();
  const descriptionId = React.useId();
  const hasHeader = title != null || description != null;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={showCloseButton}
          className={cn(
            "flex max-h-[min(90vh,52rem)] w-full flex-col gap-0 overflow-hidden p-0",
            sizeClassName[size],
            className,
            contentClassName,
          )}
          aria-describedby={description ? descriptionId : undefined}
        >
          {hasHeader ? (
            <DialogHeader className="shrink-0 space-y-1.5 border-b border-border/70 px-4 py-4 pr-12 text-left sm:px-5">
              {title != null ? (
                <DialogTitle id={titleId}>{title}</DialogTitle>
              ) : (
                <DialogTitle id={titleId} className="sr-only">
                  Dialog
                </DialogTitle>
              )}
              {description != null ? (
                <DialogDescription id={descriptionId}>
                  {description}
                </DialogDescription>
              ) : null}
            </DialogHeader>
          ) : (
            <DialogTitle className="sr-only">Dialog</DialogTitle>
          )}

          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5",
              "[scrollbar-width:thin]",
              bodyClassName,
            )}
          >
            {children}
          </div>

          {footer != null ? (
            <DialogFooter
              className={cn(
                "mt-0 shrink-0 rounded-none border-t border-border/70 bg-muted/40 px-4 py-3 sm:px-5",
                footerClassName,
              )}
            >
              {footer}
            </DialogFooter>
          ) : null}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground>
      <DrawerContent
        className={cn("flex max-h-[92vh] flex-col gap-0", className)}
      >
        {hasHeader ? (
          <DrawerHeader className="relative shrink-0 border-b border-border/70 pb-3">
            {title != null ? (
              <DrawerTitle id={titleId}>{title}</DrawerTitle>
            ) : (
              <DrawerTitle id={titleId} className="sr-only">
                Drawer
              </DrawerTitle>
            )}
            {description != null ? (
              <DrawerDescription id={descriptionId}>
                {description}
              </DrawerDescription>
            ) : null}
            {showCloseButton ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-3 right-3"
                aria-label="Close"
                onClick={() => onOpenChange(false)}
              >
                <XIcon className="size-4" />
              </Button>
            ) : null}
          </DrawerHeader>
        ) : (
          <DrawerTitle className="sr-only">Drawer</DrawerTitle>
        )}

        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4",
            "[scrollbar-width:thin]",
            bodyClassName,
          )}
        >
          {children}
        </div>

        {footer != null ? (
          <DrawerFooter
            className={cn(
              "flex-row justify-end gap-2 sm:flex-row",
              footerClassName,
            )}
          >
            {footer}
          </DrawerFooter>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}

export function ResponsiveModalActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="responsive-modal-actions"
      className={cn(
        "flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}
