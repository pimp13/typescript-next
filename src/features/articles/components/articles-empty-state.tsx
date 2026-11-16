type ArticlesEmptyStateProps = {
  variant: "error" | "empty";
};

export function ArticlesEmptyState({ variant }: ArticlesEmptyStateProps) {
  if (variant === "error") {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <p className="text-sm font-medium text-foreground">
          Could not load articles
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in against the Go API and ensure you have{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            articles:read
          </code>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-16 text-center">
      <p className="text-base font-medium tracking-tight">No articles yet</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Create your first draft to populate this workspace.
      </p>
    </div>
  );
}
