import { apiFetch, GO_API_URL } from "@/lib/api";

export default async function ArticlesPage() {
  const response = await apiFetch('/', { method: 'GET' }, GO_API_URL);

  return (
    <div>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
}