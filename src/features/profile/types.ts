export type PublicProfile = {
  id: string;
  first_name: string;
  last_name: string;
  username?: string;
  avatar?: string;
  role: string;
  role_name: string;
  status: string;
  created_at: string;
};

export type UpdateProfileInput = {
  first_name: string;
  last_name: string;
  username?: string;
  phone?: string;
  avatar?: string;
};

export type ChangePasswordInput = {
  current_password: string;
  new_password: string;
};

export function profileHandle(user: {
  id: string;
  username?: string | null;
}) {
  const username = user.username?.trim();
  return username || user.id;
}

export function profilePath(user: { id: string; username?: string | null }) {
  return `/@${profileHandle(user)}`;
}

export function profileDisplayName(profile: {
  first_name?: string;
  last_name?: string;
  username?: string;
}) {
  const name = [profile.first_name, profile.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return name || profile.username || "Member";
}
