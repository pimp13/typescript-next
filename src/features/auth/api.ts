import { apiFetch } from "@/lib/api";
import type { LoginInput, RegisterInput, User } from "./types";

export function login(input: LoginInput) {
  return apiFetch<User>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function register(input: RegisterInput) {
  return apiFetch<User>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function logout() {
  return apiFetch<undefined>("/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "*/*",
    },
  });
}

export function getMe() {
  return apiFetch<User>("/api/auth/me", {
    method: "GET",
  });
}
