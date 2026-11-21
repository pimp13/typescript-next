import { goApiFetch, type ApiResponse } from "@/lib/api";
import {
  mapGoAuthUser,
  type GoAuthUser,
  type GoSession,
  type User,
} from "@/features/auth/types";
import type {
  ChangePasswordInput,
  PublicProfile,
  UpdateProfileInput,
} from "@/features/profile/types";

export async function getPublicProfile(handle: string) {
  const response = await goApiFetch<PublicProfile>(
    `/public/users/${encodeURIComponent(handle)}`,
    { method: "GET" },
  );
  return response.data;
}

export async function updateProfile(input: UpdateProfileInput) {
  const response = await goApiFetch<GoAuthUser>("/auth/profile", {
    method: "PUT",
    body: JSON.stringify({
      first_name: input.first_name,
      last_name: input.last_name,
      username: input.username || "",
      phone: input.phone || "",
      avatar: input.avatar || "",
    }),
  });
  return {
    ...response,
    data: response.data ? mapGoAuthUser(response.data) : undefined,
  } satisfies ApiResponse<User>;
}

export async function changePassword(input: ChangePasswordInput) {
  const response = await goApiFetch<GoSession>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return {
    ...response,
    data: response.data?.user
      ? mapGoAuthUser(response.data.user)
      : undefined,
  } satisfies ApiResponse<User>;
}
