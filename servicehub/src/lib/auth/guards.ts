import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { homeForRole } from "./destinations";
import { safeReturnPath } from "./return-path";
import { getCurrentUser } from "./users";
import type { Role } from "@/types/auth";

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    const pathname = (await headers()).get("x-pathname") ?? "";
    const returnTo = safeReturnPath(pathname);
    redirect(returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login");
  }
  return user;
}

export async function requireRole(...roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/dashboard/profile");
  return user;
}

export async function redirectIfAuthenticated(returnTo?: string | null) {
  const user = await getCurrentUser();
  if (!user) return;
  redirect(safeReturnPath(returnTo) ?? homeForRole(user.role));
}
