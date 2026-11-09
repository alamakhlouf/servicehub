import { NextResponse } from "next/server";

export function authUnavailable(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  const misconfigured = message.includes("AUTH_SECRET") || message.includes("MONGODB_URI") || message.includes("MONGODB_DB");
  console.error(misconfigured ? "Authentication is not configured:" : "Authentication service unavailable:", error);
  return NextResponse.json(
    {
      error: misconfigured
        ? "Authentication is not configured. Check AUTH_SECRET, MONGODB_URI, and MONGODB_DB, then try again."
        : "ServiceHub cannot reach its database. Check MongoDB and your environment configuration, then try again.",
    },
    { status: 503 },
  );
}
