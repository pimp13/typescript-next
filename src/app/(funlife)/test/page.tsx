import { apiFetch, GO_API_URL } from "@/lib/api";

export const instant = false;

export default async function TestPage() {
  const response = await apiFetch("/", { method: "GET" }, GO_API_URL);

  return (
    <div>
      <p>Hello world</p>
      <pre className="mt-4 text-sm text-muted-foreground">
        {JSON.stringify(response, null, 2)}
      </pre>
    </div>
  );
}
