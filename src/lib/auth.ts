import { apiFetch } from "./api";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

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
  });
}

export function getMe() {
  return apiFetch<User>("/api/auth/me", {
    method: "GET",
  });
}
