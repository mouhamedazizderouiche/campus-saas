import { Suspense } from "react";
import Link from "next/link";
import { EmptyState } from "@/src/components/shared/empty-state";
import { PageHeading } from "@/src/components/shared/page-heading";
import { AppShell, AppShellFallback } from "@/src/features/app-shell/app-shell";

export default function MatchesPage() {
  return (
    <Suspense fallback={<AppShellFallback />}>
      <AppShell active="matches">
        <div className="space-y-7">
          <PageHeading
            description="A mutual like is the beginning of a new campus hello."
            eyebrow="A little spark, both ways"
            title="Matches"
            action={<span className="w-fit rounded-full border border-line bg-white px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">Backend not connected</span>}
          />
          <EmptyState
            action={<Link className="rounded-xl bg-violet px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-dark" href="/dashboard">Explore discovery preview</Link>}
            description="This screen does not contain sample matches. Matches will appear only after mutual likes are persisted and verified by the future matching service."
            symbol="♡"
            title="Your matches will meet you here"
          />
          <p className="mx-auto max-w-2xl text-center text-xs leading-5 text-muted">Matching is a visual prototype. There is no likes table, match creation, or participant authorization in this project yet.</p>
        </div>
      </AppShell>
    </Suspense>
  );
}
