import { NextResponse } from "next/server";
import { authUnavailable } from "@/lib/auth/http";
import { readCurrentUser } from "@/lib/auth/users";

export async function GET() {
  try {
    const user = await readCurrentUser();
    return user ? NextResponse.json({ user }) : NextResponse.json({ error: "Authentication required." }, { status: 401 });
  } catch (error) {
    return authUnavailable(error);
  }
}
