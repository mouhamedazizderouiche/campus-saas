import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { AppShell, AppShellFallback } from "@/src/features/app-shell/app-shell";
import { EmptyState } from "@/src/components/shared/empty-state";
import { PageHeading } from "@/src/components/shared/page-heading";
import { getDevelopmentCampusContent } from "@/src/features/campus/dev-fixtures";

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

async function CommunityContent() {
  await connection();
  const { posts } = getDevelopmentCampusContent(process.env.NODE_ENV);

  return (
      <AppShell active="community">
        <main className="space-y-7">
          <PageHeading
            description="Campus updates, shared interests, and small ways to find your people."
            eyebrow="Good things happen together"
            title="Community"
            action={<span className="w-fit rounded-full border border-[#eadff5] bg-white px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-violet">{posts.length ? "Fictional demo feed" : "Feed unavailable"}</span>}
          />
          <section aria-label="Community feed" className="mx-auto max-w-3xl space-y-4">
            {posts.length ? posts.map((post) => (
              <article className="rounded-[24px] border border-line bg-white p-5 shadow-[0_10px_30px_rgba(44,31,57,.035)] sm:p-6" key={post.id}>
                <div className="flex items-start gap-3">
                  <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-2xl bg-violet-soft text-sm font-extrabold text-violet">{post.author.slice(0, 1)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h2 className="text-sm font-extrabold">{post.author}</h2>
                      <span aria-hidden="true" className="text-[#b6adbb]">·</span>
                      <time className="text-[11px] text-muted" dateTime={post.createdAt}>{formatTimestamp(post.createdAt)}</time>
                    </div>
                    <span className="mt-1 inline-flex rounded-full bg-[#f5f1f7] px-2.5 py-1 text-[9px] font-bold text-[#71627d]">{post.category}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#514958]">{post.content}</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#8c7d98]">{post.demoLabel}</span>
                  <span className="text-[10px] font-semibold text-muted">Reactions and replies are not connected</span>
                </div>
              </article>
            )) : <EmptyState
              action={<Link className="rounded-xl bg-violet px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-dark" href="/dashboard">Back to Home</Link>}
              description="Campus posts are not connected yet. No student posts are being loaded or shared here."
              symbol="✳"
              title="Your campus feed is not available yet"
            />}
            {posts.length ? <p className="text-center text-[10px] leading-5 text-muted">These fictional development examples are not real student posts. Posting, reactions, and replies are not available.</p> : null}
          </section>
        </main>
      </AppShell>
  );
}

export default function CommunityPage() {
  return <Suspense fallback={<AppShellFallback />}><CommunityContent /></Suspense>;
}
