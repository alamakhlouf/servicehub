import { describe, expect, it } from "vitest";
import { safeReturnPath } from "./return-path";

describe("safe return paths", () => {
  it("keeps same-site application paths", () => {
    expect(safeReturnPath("/dashboard/bookings?status=pending")).toBe("/dashboard/bookings?status=pending");
  });

  it("rejects external, protocol-relative, and authentication loops", () => {
    expect(safeReturnPath("https://example.com")).toBeNull();
    expect(safeReturnPath("//example.com")).toBeNull();
    expect(safeReturnPath("/login")).toBeNull();
    expect(safeReturnPath("/signup?returnTo=/login")).toBeNull();
    expect(safeReturnPath("/api/auth/me")).toBeNull();
  });
});
