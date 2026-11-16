export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
export const GO_API_URL =
  process.env.NEXT_PUBLIC_GO_API_URL ?? "http://localhost:7000/api";

export type ApiResponse<T> = {
  ok?: boolean;
  success?: boolean;
  message?: string;
  data?: T;
};

type GoApiEnvelope<T> = {
  result?: {
    success?: boolean;
    data?: T;
    error?: {
      code?: string;
      message?: string;
    } | null;
  };
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function normalizePayload<T>(payload: unknown): ApiResponse<T> {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  const record = payload as ApiResponse<T> & GoApiEnvelope<T>;

  if (record.result && typeof record.result === "object") {
    return {
      success: record.result.success,
      data: record.result.data,
      message: record.result.error?.message,
    };
  }

  return {
    ok: record.ok,
    success: record.success,
    data: record.data,
    message: record.message,
  };
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

  const raw = (await response.json()) as unknown;
  const payload = normalizePayload<T>(raw);

  // Go API uses nested `result.success`; Fastify uses top-level `ok`.
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

export function goApiFetch<T>(path: string, init?: RequestInit) {
  return apiFetch<T>(path, init, GO_API_URL);
}
