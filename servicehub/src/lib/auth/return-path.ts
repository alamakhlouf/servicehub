const BLOCKED_PREFIXES = ["/login", "/signup", "/api"];

export function safeReturnPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\u0000-\u001F]/.test(value)) return null;

  let url: URL;
  try {
    url = new URL(value, "http://servicehub.local");
  } catch {
    return null;
  }

  if (url.origin !== "http://servicehub.local") return null;
  if (BLOCKED_PREFIXES.some((prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`))) return null;
  return `${url.pathname}${url.search}`;
}
