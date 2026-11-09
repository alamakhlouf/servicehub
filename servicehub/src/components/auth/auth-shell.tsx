import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto flex w-full max-w-7xl justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {children}
    </section>
  );
}
