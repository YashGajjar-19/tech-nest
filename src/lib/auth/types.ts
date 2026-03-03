export type AppRole = "user" | "editor" | "admin" | "super_admin";

export interface AuthUser {
  id: string;
  email: string;
  role: AppRole;
  full_name?: string | null;
  avatar_url?: string | null;
}

export const ROLE_RANKS: Record<AppRole, number> = {
  user: 1,
  editor: 2,
  admin: 3,
  super_admin: 4,
};

export function hasMinRole(userRole: AppRole, minRole: AppRole): boolean {
  return ROLE_RANKS[userRole] >= ROLE_RANKS[minRole];
}

export function isAdmin(role: AppRole | null | undefined): boolean {
  return role === "admin" || role === "super_admin";
}
