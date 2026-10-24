import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/src/features/auth/actions";
import { getCurrentUser } from "@/src/features/auth/user";
import { CompuceLogo } from "@/src/components/shared/compuce-logo";

export type AppSection =
  | "home"
  | "community"
  | "discover"
  | "events"
  | "matches"
  | "messages"
  | "profile";

const navigation: Array<{
  id: AppSection;
  label: string;
  href: string;
  icon: "home" | "community" | "compass" | "calendar" | "heart" | "message" | "user";
}> = [
  { id: "home", label: "Home", href: "/dashboard", icon: "home" },
  { id: "community", label: "Community", href: "/community", icon: "community" },
  { id: "discover", label: "Discover", href: "/discover", icon: "compass" },
  { id: "events", label: "Events", href: "/events", icon: "calendar" },
  { id: "matches", label: "Matches", href: "/matches", icon: "heart" },
  { id: "messages", label: "Messages", href: "/messages", icon: "message" },
  { id: "profile", label: "My profile", href: "/profile", icon: "user" },
];

function NavIcon({ name, active = false }: { name: (typeof navigation)[number]["icon"]; active?: boolean }) {
  const className = `size-[19px] shrink-0 ${active ? "text-violet" : "text-muted"}`;
  const common = {
    className,
    fill: "none",
    height: 20,
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
    width: 20,
    "aria-hidden": true as const,
  };

  if (name === "home") {
    return <svg {...common}><path d="m3.5 10 8.5-7 8.5 7v9.5a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1V10Z" /><path d="M9 20.5v-7h6v7" /></svg>;
  }
  if (name === "community") {
    return <svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3.5 20c.3-3.4 2.2-5.2 5.5-5.2s5.2 1.8 5.5 5.2" /><path d="M15 5.3a3 3 0 0 1 0 5.7m2.2 3.9c2 .8 3.1 2.5 3.3 5.1" /></svg>;
  }
  if (name === "calendar") {
    return <svg {...common}><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M7.5 3v4m9-4v4M4 9.5h16" /><path d="M8 13h.01m4 0h.01m4 0h.01M8 17h.01m4 0h.01" strokeWidth="2.5" /></svg>;
  }
  if (name === "heart") {
    return <svg {...common}><path d="M20.8 8.8c0 5.2-8.8 10.4-8.8 10.4S3.2 14 3.2 8.8a4.2 4.2 0 0 1 8.8-1.2 4.2 4.2 0 0 1 8.8 1.2Z" /></svg>;
  }
  if (name === "message") {
    return <svg {...common}><path d="M20 11.4a7.7 7.7 0 0 1-8 7.3 9.2 9.2 0 0 1-3.7-.7L4 19l1.2-3.5A7 7 0 0 1 4 11.4a7.7 7.7 0 0 1 8-7.3 7.7 7.7 0 0 1 8 7.3Z" /><path d="M8.5 11.5h.01m3.5 0h.01m3.5 0h.01" strokeWidth="2.5" /></svg>;
  }
  if (name === "user") {
    return <svg {...common}><circle cx="12" cy="8" r="3.4" /><path d="M5.3 19c.6-3 3.1-4.8 6.7-4.8s6.1 1.8 6.7 4.8" /></svg>;
  }
  return <svg {...common}><circle cx="12" cy="12" r="8.3" /><path d="m14.9 9.1-2 4-3.8 1.8 1.8-3.8 4-2Z" /><circle cx="12" cy="12" r=".7" fill="currentColor" stroke="none" /></svg>;
}

function AccountMenu({ email }: { email: string | null }) {
  const initials = email?.trim().charAt(0).toUpperCase() || "C";

  return (
    <details className="relative">
      <summary aria-label="Open account menu" className="flex cursor-pointer list-none items-center gap-2 rounded-2xl border border-line bg-white p-1.5 pr-3 shadow-sm transition hover:border-violet/25 [&::-webkit-details-marker]:hidden">
        <span className="grid size-9 place-items-center rounded-[13px] bg-violet-soft text-sm font-extrabold text-violet">{initials}</span>
        <span className="hidden max-w-36 truncate text-xs font-bold text-foreground sm:block">{email ?? "Your account"}</span>
        <svg aria-hidden="true" className="size-3.5 text-muted" fill="none" viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /></svg>
      </summary>
      <div className="absolute right-0 z-30 mt-2 w-64 rounded-2xl border border-line bg-white p-3 shadow-[0_16px_45px_rgba(40,25,50,.14)]">
        <p className="truncate px-2 py-2 text-xs font-semibold text-muted">{email ?? "Signed in to Compuce"}</p>
        <form action={signOutAction}>
          <button className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-bold text-foreground transition hover:bg-coral-soft hover:text-[#b44d60]" type="submit">Sign out</button>
        </form>
      </div>
    </details>
  );
}

export function AppShellFallback() {
  return (
    <div aria-label="Loading Compuce" className="min-h-screen animate-pulse bg-background">
      <div className="h-16 border-b border-line bg-white/60" />
      <div className="mx-auto mt-8 h-[70vh] max-w-6xl rounded-[28px] bg-white/70" />
    </div>
  );
}

export async function AppShell({
  active,
  children,
}: {
  active: AppSection;
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    const destination = navigation.find((item) => item.id === active)?.href ?? "/dashboard";
    redirect(`/sign-in?next=${encodeURIComponent(destination)}`);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-20 flex-col border-r border-line bg-[#fcfbf9] px-3 py-6 md:flex lg:w-[248px] lg:px-5 xl:w-[270px] xl:px-7">
        <Link aria-label="Compuce home" className="mx-auto w-fit rounded-xl lg:mx-0" href="/dashboard"><CompuceLogo compact /><span className="sr-only">Compuce</span></Link>
        <p className="ml-1 mt-3 hidden text-[11px] font-semibold tracking-wide text-muted lg:block">your campus, closer</p>

        <div className="mb-3 mt-11 hidden px-3 text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#a29aa8] lg:block">Your space</div>
        <nav aria-label="Main navigation" className="space-y-1.5">
          {navigation.map((item) => {
            const isActive = active === item.id;
            return (
              <Link aria-current={isActive ? "page" : undefined} className={`group flex items-center justify-center gap-3 rounded-2xl px-2 py-3 text-sm font-bold transition lg:justify-start lg:px-3.5 ${isActive ? "bg-violet-soft text-violet" : "text-muted hover:bg-white hover:text-foreground"}`} href={item.href} key={item.id} title={item.label}>
                <NavIcon active={isActive} name={item.icon} />
                <span className="hidden lg:inline">{item.label}</span>
                {item.id === "messages" ? <span className="ml-auto hidden rounded-full bg-[#f1edf4] px-2 py-0.5 text-[10px] font-bold text-muted xl:inline">preview</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden rounded-[22px] border border-[#e8e0f1] bg-gradient-to-br from-[#f5f0fb] to-[#fff8f6] p-4 lg:block">
          <span aria-hidden="true" className="grid size-9 place-items-center rounded-xl bg-white text-lg text-violet shadow-sm">✦</span>
          <p className="mt-3 text-sm font-extrabold">A kinder kind of connection.</p>
          <p className="mt-1 text-xs leading-5 text-muted">Dating, friendship, or both. Always your choice.</p>
        </div>
        <p className="mt-5 px-1 text-[10px] font-medium text-[#aaa3af]">COMPUCE · EARLY PREVIEW</p>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col md:pl-20 lg:pl-[248px] xl:pl-[270px]">
        <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-line/80 bg-background/90 px-5 backdrop-blur-xl sm:px-8">
          <Link aria-label="Compuce home" className="rounded-xl md:hidden" href="/dashboard"><CompuceLogo compact /></Link>
          <p className="hidden text-xs font-extrabold uppercase tracking-[0.16em] text-violet md:block">A campus social preview</p>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden rounded-full border border-[#e9e1f2] bg-white px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.11em] text-violet sm:inline-flex">Early access</span>
            <AccountMenu email={user.email} />
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-28 pt-7 sm:px-7 sm:pt-9 lg:px-10 lg:pb-12 xl:px-14">
          {children}
        </div>
      </div>

      <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white/95 px-1 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(40,25,50,.07)] backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-2xl grid-cols-7 gap-0.5">
          {navigation.map((item) => {
            const isActive = active === item.id;
            return (
              <Link aria-current={isActive ? "page" : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[8px] font-bold transition min-[390px]:text-[9px] ${isActive ? "text-violet" : "text-muted hover:bg-background"}`} href={item.href} key={item.id}>
                <NavIcon active={isActive} name={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
