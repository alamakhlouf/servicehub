"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthModeNotice } from "@/components/auth/auth-mode-notice";
import { useOnline } from "@/components/auth/use-online";
import { Button, Card, Input, Textarea } from "@/components/ui";
import type { SafeUser } from "@/types/auth";

export function ProfileEditForm({ user }: { user: SafeUser }) {
  const router = useRouter();
  const online = useOnline();
  const [values, setValues] = useState({ name: user.name, phone: user.phone ?? "", city: user.city ?? "", bio: user.bio ?? "" });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const update = (field: keyof typeof values, value: string) => setValues((current) => ({ ...current, [field]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setErrors({});
    if (!navigator.onLine) {
      setError("You are offline. Profile changes are saved only while ServiceHub is online.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = (await response.json().catch(() => ({}))) as { error?: string; fieldErrors?: Record<string, string[]> };
      if (!response.ok) {
        setError(data.error ?? "We couldn't save your profile.");
        setErrors(Object.fromEntries(Object.entries(data.fieldErrors ?? {}).map(([key, messages]) => [key, messages[0] ?? ""])));
        return;
      }
      router.replace("/dashboard/profile");
      router.refresh();
    } catch {
      setError(navigator.onLine ? "We couldn't reach ServiceHub. Check your connection and try again." : "You are offline. Profile changes are saved only while ServiceHub is online.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl p-5 sm:p-7">
      <AuthModeNotice
        offlineText="Edits stay on this screen until you reconnect. Nothing is saved while offline."
        online={online}
        onlineText="Profile changes are saved to your account."
      />
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-300">Authentication</p>
        <h1 className="mt-2 font-display text-2xl font-bold">Edit your profile</h1>
        <p className="mt-2 text-sm text-text-muted">Keep your contact details current for the people you work with.</p>
      </div>
      {error ? <div aria-live="polite" className="mb-5 rounded-md border border-error/50 bg-error/10 px-3 py-2.5 text-sm text-red-100" role="alert">{error}</div> : null}
      <form className="grid gap-4" onSubmit={submit}>
        <Input error={errors.name} label="Full name" name="name" onChange={(event) => update("name", event.target.value)} value={values.name} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input error={errors.phone} label="Phone" name="phone" onChange={(event) => update("phone", event.target.value)} value={values.phone} />
          <Input error={errors.city} label="City" name="city" onChange={(event) => update("city", event.target.value)} value={values.city} />
        </div>
        <Textarea error={errors.bio} hint="Optional · 500 characters maximum" label="Short bio" name="bio" onChange={(event) => update("bio", event.target.value)} value={values.bio} />
        <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button onClick={() => router.back()} type="button" variant="ghost">Cancel</Button>
          <Button disabled={!online} loading={loading} type="submit">{online ? "Save changes" : "Reconnect to save"}</Button>
        </div>
      </form>
    </Card>
  );
}
