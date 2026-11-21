"use client";

import { toast } from "sonner";
import { TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function TestPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Alert & Toast</h1>
        <p className="text-sm text-muted-foreground">
          Toast برای پیام‌های کوتاه؛ AlertDialog برای تأیید کارهای مهم.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Toast — بدون دیالوگ، سریع و سبک */}
        <Button
          type="button"
          variant="outline"
          onClick={() => toast.success("Saved successfully")}
        >
          Success toast
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => toast.error("Something went wrong")}
        >
          Error toast
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            toast("Profile updated", {
              description: "Your changes are live now.",
            })
          }
        >
          Toast with description
        </Button>

        {/* AlertDialog — مودال تأیید قبل از اکشن خطرناک */}
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" />}>
            Delete item
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive">
                <TriangleAlertIcon />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete this item?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The item will be permanently
                removed from your workspace.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => toast.success("Item deleted")}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
