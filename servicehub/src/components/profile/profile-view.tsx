"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthModeNotice } from "@/components/auth/auth-mode-notice";
import { useOnline } from "@/components/auth/use-online";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import type { SafeUser } from "@/types/auth";

const snapshotKey = "servicehub_profile_snapshot";

export function ProfileView({ initialUser }: { initialUser: SafeUser }) {
  const router = useRouter();
  const online = useOnline();
  const [user, setUser] = useState(initialUser);
  const [refreshNote, setRefreshNote] = useState("");
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    localStorage.setItem(snapshotKey, JSON.stringify({ name: initialUser.name, role: initialUser.role, city: initialUser.city }));
    fetch("/api/profile")
      .then(async (response) => {
        if (!response.ok) throw new Error("profile");
        const data = (await response.json()) as { user: SafeUser };
        setUser(data.user);
        localStorage.setItem(snapshotKey, JSON.stringify({ name: data.user.name, role: data.user.role, city: data.user.city }));
      })
      .catch(() => {
        if (!navigator.onLine) return;
        setRefreshNote("We couldn't refresh your profile. The details below are from this page load.");
      });
  }, [initialUser]);

  async function logout() {
    setLogoutError("");
    if (!navigator.onLine) {
      setLogoutError("You are offline. Sign-out needs a connection so this session can be closed.");
      return;
    }
    setLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        setLogoutError("We couldn't sign you out. Try again when ServiceHub is reachable.");
        return;
      }
      localStorage.removeItem(snapshotKey);
      router.replace("/");
      router.refresh();
    } catch {
      setLogoutError("You are offline. Sign-out needs a connection so this session can be closed.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <AuthModeNotice
        offlineText="This is the account loaded earlier. Sign-out and profile edits need a connection."
        online={online}
        onlineText="This account is connected. You can review it, edit it, or sign out."
      />
      {refreshNote ? <p className="mb-4 text-sm text-text-muted" role="status">{refreshNote}</p> : null}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-300">Authentication</p>
          <h1 className="mt-2 font-display text-3xl font-bold">Profile</h1>
          <p className="mt-2 text-text-muted">Manage the details connected to your ServiceHub account.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/dashboard/profile/edit")} variant="outline">Edit profile</Button>
          <Button loading={loggingOut} onClick={logout} variant="ghost">Log out</Button>
        </div>
      </div>
      {logoutError ? <p className="mt-4 rounded-md border border-tertiary/40 bg-tertiary/10 px-3 py-2 text-sm text-amber-100" role="alert">{logoutError}</p> : null}
      <Card className="mt-8 p-5 sm:p-7">
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <Avatar name={user.name} size="lg" />
          <div>
            <h2 className="font-display text-xl font-bold">{user.name}</h2>
            <p className="mt-1 text-sm text-text-muted">{user.email}</p>
            <Badge className="mt-2" tone="primary">{user.role}</Badge>
          </div>
        </div>
        <dl className="grid gap-5 pt-6 sm:grid-cols-2">
          <Detail label="Phone" value={user.phone} />
          <Detail label="City" value={user.city} />
          <div className="sm:col-span-2"><Detail label="Bio" value={user.bio} /></div>
        </dl>
      </Card>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return <div><dt className="text-xs font-semibold text-text-subtle">{label}</dt><dd className="mt-1 text-sm">{value || "Not added yet"}</dd></div>;
}
