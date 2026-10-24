import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { AppShell, AppShellFallback } from "@/src/features/app-shell/app-shell";
import { EmptyState } from "@/src/components/shared/empty-state";
import { PageHeading } from "@/src/components/shared/page-heading";
import { getDevelopmentCampusContent } from "@/src/features/campus/dev-fixtures";

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

async function EventsContent() {
  await connection();
  const { events } = getDevelopmentCampusContent(process.env.NODE_ENV);

  return (
      <AppShell active="events">
        <main className="space-y-7">
          <PageHeading
            description="Find a reason to step away from your notes and spend time with your campus community."
            eyebrow="Make room for something fun"
            title="Events"
            action={<span className="w-fit rounded-full border border-[#eadff5] bg-white px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-violet">{events.length ? "Fictional demo events" : "Calendar unavailable"}</span>}
          />
          {events.length ? <section aria-label="Upcoming campus events" className="grid gap-4 md:grid-cols-2">
            {events.map((event) => (
              <article className="flex flex-col rounded-[24px] border border-line bg-white p-5 shadow-[0_10px_30px_rgba(44,31,57,.035)] sm:p-6" key={event.id}>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-mint px-3 py-1.5 text-[10px] font-extrabold text-[#387e61]">{event.category}</span>
                  <span className="text-[9px] font-extrabold uppercase tracking-wide text-[#8c7d98]">{event.demoLabel}</span>
                </div>
                <h2 className="mt-5 text-xl font-extrabold tracking-[-0.04em]">{event.title}</h2>
                <time className="mt-2 text-sm font-semibold text-violet" dateTime={event.startsAt}>{formatEventDate(event.startsAt)}</time>
                <dl className="mt-5 space-y-2 border-t border-line pt-4 text-xs">
                  <div className="flex gap-2"><dt className="w-20 shrink-0 font-bold text-muted">Where</dt><dd>{event.location}</dd></div>
                  <div className="flex gap-2"><dt className="w-20 shrink-0 font-bold text-muted">Organized by</dt><dd>{event.organizer}</dd></div>
                </dl>
                <details className="group mt-5 border-t border-line pt-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-extrabold text-violet focus-visible:rounded-md [&::-webkit-details-marker]:hidden">
                    Event details
                    <span aria-hidden="true" className="transition group-open:rotate-180">⌄</span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-muted">{event.description}</p>
                </details>
              </article>
            ))}
            <p className="text-[10px] leading-5 text-muted md:col-span-2">All events shown are fictional development examples. They have no real organizer, location, attendance, or RSVP.</p>
          </section> : <EmptyState
            action={<Link className="rounded-xl bg-violet px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-dark" href="/dashboard">Back to Home</Link>}
            description="No campus calendar is connected yet. Real event dates, locations, organizers, and descriptions will appear when an authorized events source is available."
            symbol="⌁"
            title="Upcoming events will show here"
          />}
        </main>
      </AppShell>
  );
}

export default function EventsPage() {
  return <Suspense fallback={<AppShellFallback />}><EventsContent /></Suspense>;
}
