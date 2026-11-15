export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
export const GO_API_URL = process.env.NEXT_PUBLIC_GO_API_URL ?? "http://localhost:7000/api";

export type ApiResponse<T> = {
  ok?: boolean;
  success?: boolean;
  message?: string;
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
  basePath: string = API_URL,
): Promise<ApiResponse<T>> {
  const headers = new Headers(init?.headers);

  if (init?.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${basePath}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  const payload = (await response.json()) as ApiResponse<T>;

  // Go API uses `success`, Fastify uses `ok`. Accept either.
  const succeeded =
    response.ok &&
    (payload.ok === true ||
      payload.success === true ||
      (payload.ok === undefined && payload.success === undefined));

  if (!succeeded) {
    throw new ApiError(payload.message || "Request failed", response.status);
  }

  return payload;
}
