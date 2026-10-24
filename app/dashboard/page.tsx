import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { AppShell, AppShellFallback } from "@/src/features/app-shell/app-shell";
import { getDevelopmentCampusContent } from "@/src/features/campus/dev-fixtures";

const quickLinks = [
  { href: "/community", label: "Join the community", symbol: "✳", description: "See what's being shared around campus" },
  { href: "/discover", label: "Meet someone new", symbol: "♡", description: "Explore friendship, dating, or both" },
  { href: "/events", label: "Find an activity", symbol: "⌁", description: "Browse campus events and meetups" },
  { href: "/messages", label: "Open messages", symbol: "↗", description: "Conversations after a mutual match" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

async function DashboardContent() {
  await connection();
  const content = getDevelopmentCampusContent(process.env.NODE_ENV);

  return (
      <AppShell active="home">
        <main className="space-y-8">
          <section className="flex flex-col gap-5 rounded-[28px] bg-white px-6 py-7 shadow-[0_12px_40px_rgba(44,31,57,.045)] sm:px-9 sm:py-9 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet">Your campus, closer</p>
              <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.06em] sm:text-[2.65rem]">Welcome to your campus</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">A place to catch up, find your people, and see what’s happening around you.</p>
            </div>
            <span className="w-fit rounded-full border border-[#e9e1f2] bg-[#fbf9fd] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-violet">Campus details not set up</span>
          </section>

          <section aria-labelledby="quick-actions-heading">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet">A good place to start</p>
                <h2 className="mt-1 text-xl font-extrabold tracking-[-0.04em]" id="quick-actions-heading">Make yourself at home</h2>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {quickLinks.map((item) => (
                <Link className="group rounded-[22px] border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-violet/25 hover:shadow-[0_12px_30px_rgba(44,31,57,.06)] focus-visible:outline-offset-4" href={item.href} key={item.href}>
                  <span aria-hidden="true" className="grid size-10 place-items-center rounded-[14px] bg-violet-soft text-xl text-violet">{item.symbol}</span>
                  <h3 className="mt-4 text-sm font-extrabold group-hover:text-violet">{item.label}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted">{item.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)]">
            <section aria-labelledby="updates-heading" className="rounded-[26px] border border-line bg-white p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-violet">Around your campus</p>
                  <h2 className="mt-1 text-xl font-extrabold tracking-[-0.04em]" id="updates-heading">Campus updates</h2>
                </div>
                <Link className="text-xs font-bold text-violet underline-offset-4 hover:underline" href="/community">Community <span aria-hidden="true">→</span></Link>
              </div>
              {content.posts.length ? <div className="space-y-3">{content.posts.slice(0, 2).map((post) => (
                <article className="rounded-2xl bg-[#faf9fb] p-4" key={post.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-extrabold">{post.author}</span>
                    <time className="text-[10px] text-muted" dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#514958]">{post.content}</p>
                  <p className="mt-3 text-[9px] font-bold uppercase tracking-wide text-[#8c7d98]">{post.demoLabel}</p>
                </article>
              ))}</div> : <div className="rounded-2xl border border-dashed border-line bg-[#fcfbfc] px-5 py-8 text-center"><p className="text-sm font-bold">No campus updates yet</p><p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted">Community posts will appear here when a campus feed is connected.</p></div>}
            </section>

            <section aria-labelledby="events-heading" className="rounded-[26px] border border-line bg-white p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-violet">Make a plan</p>
                  <h2 className="mt-1 text-xl font-extrabold tracking-[-0.04em]" id="events-heading">Coming up</h2>
                </div>
                <Link className="text-xs font-bold text-violet underline-offset-4 hover:underline" href="/events">All events <span aria-hidden="true">→</span></Link>
              </div>
              {content.events.length ? <div className="space-y-3">{content.events.slice(0, 2).map((event) => (
                <article className="rounded-2xl border border-line p-4" key={event.id}>
                  <div className="flex items-center justify-between gap-2"><span className="rounded-full bg-mint px-2.5 py-1 text-[9px] font-extrabold text-[#387e61]">{event.category}</span><span className="text-[9px] font-bold text-muted">Demo</span></div>
                  <h3 className="mt-3 text-sm font-extrabold">{event.title}</h3>
                  <p className="mt-1 text-xs text-muted">{formatDate(event.startsAt)}</p>
                  <p className="mt-1 text-xs text-muted">{event.location}</p>
                  <p className="mt-3 text-[9px] font-bold uppercase tracking-wide text-[#8c7d98]">{event.demoLabel}</p>
                </article>
              ))}</div> : <div className="rounded-2xl border border-dashed border-line bg-[#fcfbfc] px-5 py-8 text-center"><p className="text-sm font-bold">No upcoming events</p><p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted">Events will show here once your campus calendar is available.</p></div>}
            </section>
          </div>
          <p className="text-center text-[10px] leading-5 text-muted">{content.posts.length || content.events.length ? "Development preview content is fictional and is not connected to a campus or student account." : "Campus updates, events, and student activities are not connected yet."}</p>
        </main>
      </AppShell>
  );
}

export default function DashboardPage() {
  return <Suspense fallback={<AppShellFallback />}><DashboardContent /></Suspense>;
}
