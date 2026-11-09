import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { authUnavailable } from "@/lib/auth/http";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { findUserByEmail, toSafeUser } from "@/lib/auth/users";
import { loginSchema } from "@/lib/auth/validation";

let dummyHashPromise: Promise<string> | undefined;

function dummyHash() {
  dummyHashPromise ??= bcrypt.hash("servicehub-auth-timing", 12);
  return dummyHashPromise;
}

async function passwordMatches(password: string, passwordHash?: string) {
  const matches = await bcrypt.compare(password, passwordHash ?? await dummyHash());
  return Boolean(passwordHash) && matches;
}

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter your email and password.", fieldErrors: parsed.error.flatten().fieldErrors }, { status: 400 });

  try {
    const user = await findUserByEmail(parsed.data.email);
    const matches = await passwordMatches(parsed.data.password, user?.passwordHash);
    if (!user || !matches) {
      return NextResponse.json({ error: "We couldn't sign you in with those details." }, { status: 401 });
    }
    const safeUser = toSafeUser(user);
    const response = NextResponse.json({ user: safeUser });
    response.cookies.set(SESSION_COOKIE, await createSessionToken(safeUser), sessionCookieOptions());
    return response;
  } catch (error) {
    return authUnavailable(error);
  }
}
