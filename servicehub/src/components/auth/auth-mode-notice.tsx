export function AuthModeNotice({ online, onlineText, offlineText }: { online: boolean; onlineText: string; offlineText: string }) {
  return (
    <p
      aria-live="polite"
      className={online
        ? "mb-4 rounded-md border border-secondary/40 bg-secondary/10 px-4 py-3 text-sm leading-6 text-emerald-100"
        : "mb-4 rounded-md border border-tertiary/40 bg-tertiary/10 px-4 py-3 text-sm leading-6 text-amber-100"}
      role="status"
    >
      <span className="font-semibold">{online ? "Online mode." : "Offline mode."}</span>{" "}
      {online ? onlineText : offlineText}
    </p>
  );
}
