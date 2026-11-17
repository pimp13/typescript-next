import { goApiFetch, type ApiResponse } from "@/lib/api";
import {
  mapGoAuthUser,
  type GoAuthUser,
  type GoSession,
  type LoginInput,
  type RegisterInput,
  type User,
} from "./types";

function asUserResponse(
  payload: ApiResponse<GoAuthUser | GoSession | User>,
): ApiResponse<User> {
  const raw = payload.data;
  if (!raw) {
    return { ...payload, data: undefined };
  }

  if ("user" in raw && raw.user) {
    return { ...payload, data: mapGoAuthUser(raw.user) };
  }

  if ("first_name" in raw || "permissions" in raw) {
    return { ...payload, data: mapGoAuthUser(raw as GoAuthUser) };
  }

  return payload as ApiResponse<User>;
}

export async function login(input: LoginInput) {
  const response = await goApiFetch<GoSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return asUserResponse(response);
}

export async function register(input: RegisterInput) {
  await goApiFetch<GoAuthUser>("/auth/sign-up", {
    method: "POST",
    body: JSON.stringify(input),
  });
  // Go sign-up does not set the cookie — sign in immediately.
  return login({ email: input.email, password: input.password });
}

export function logout() {
  return goApiFetch<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}

export async function getMe() {
  const response = await goApiFetch<GoAuthUser>("/auth/me", {
    method: "GET",
  });
  return asUserResponse(response);
}
