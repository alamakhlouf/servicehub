import type { Role } from "@/types/auth";

export function homeForRole(role: Role | string | undefined) {
  if (role === "PROVIDER") return "/dashboard/my-services";
  if (role === "SUPPLIER") return "/dashboard/my-listings";
  if (role === "ADMIN") return "/admin/reports";
  if (role === "CUSTOMER") return "/dashboard/bookings";
  return "/dashboard/profile";
}
