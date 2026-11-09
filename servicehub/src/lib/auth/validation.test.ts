import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema } from "./validation";

describe("signup validation", () => {
  const account = { name: "Ala Eddine Makhlouf", email: "ala@example.com", password: "password123" };

  it("accepts canonical public role values", () => {
    expect(signupSchema.safeParse({ ...account, role: "PROVIDER" }).success).toBe(true);
  });

  it("rejects presentation-case role values", () => {
    expect(signupSchema.safeParse({ ...account, role: "provider" }).success).toBe(false);
  });
});

describe("login validation", () => {
  it("accepts any non-empty password and rejects a blank one", () => {
    expect(loginSchema.safeParse({ email: "ala@example.com", password: "short" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "ala@example.com", password: "" }).success).toBe(false);
  });
});
