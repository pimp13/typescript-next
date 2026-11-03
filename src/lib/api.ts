const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export type ApiResponse<T> = {
  ok: boolean;
  message: string;
  data?: T;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const headers = new Headers(init?.headers);

  if (init?.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.ok) {
    throw new ApiError(payload.message || "Request failed", response.status);
  }

  return payload;
}
