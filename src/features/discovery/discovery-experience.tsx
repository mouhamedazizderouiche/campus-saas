"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState } from "@/src/components/shared/empty-state";
import { InterestTag } from "@/src/components/shared/interest-tag";
import { PageHeading } from "@/src/components/shared/page-heading";
import { filterDiscoveryProfiles, type IntentionFilter } from "@/src/features/discovery/filter-profiles";
import type { DiscoveryProfile } from "@/src/features/discovery/types";

const intentionFilters: IntentionFilter[] = ["All", "Dating", "Friendship", "Both"];

export function DiscoveryExperience({ profiles }: { profiles: DiscoveryProfile[] }) {
  const [intention, setIntention] = useState<IntentionFilter>("All");
  const [interest, setInterest] = useState<string | null>(null);
  const [profileIndex, setProfileIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const filteredProfiles = useMemo(
    () => filterDiscoveryProfiles(profiles, intention, interest),
    [profiles, intention, interest],
  );
  const profile = filteredProfiles[profileIndex];
  const interests = [...new Set(profiles.flatMap((item) => item.interests))];

  function chooseIntention(next: IntentionFilter) {
    setIntention(next);
    setProfileIndex(0);
    setFeedback("");
  }

  function chooseInterest(next: string | null) {
    setInterest(next);
    setProfileIndex(0);
    setFeedback("");
  }

  function previewAction(action: "Like" | "Pass") {
    if (!profile) return;
    setFeedback(`${action} preview for ${profile.name}. Nothing was sent or saved.`);
    setProfileIndex((current) => current + 1);
  }

  return (
    <div className="space-y-7">
      <PageHeading
        description="A thoughtful way to meet people who share your campus energy."
        eyebrow="Your next hello"
        title="Discover"
        action={
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#eadff5] bg-white px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-violet">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-coral" />
            Development preview
          </span>
        }
      />

      <section aria-label="Discovery filters" className="rounded-[24px] border border-line bg-white p-4 shadow-[0_8px_28px_rgba(44,31,57,.035)] sm:p-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <fieldset>
            <legend className="mb-2.5 text-xs font-extrabold text-foreground">I’m open to</legend>
            <div className="flex flex-wrap gap-2">
              {intentionFilters.map((filter) => (
                <button
                  aria-pressed={intention === filter}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${intention === filter ? "bg-violet text-white shadow-sm" : "bg-[#f7f5f8] text-muted hover:bg-violet-soft hover:text-violet"}`}
                  key={filter}
                  onClick={() => chooseIntention(filter)}
                  type="button"
                >
                  {filter === "All" ? "Any intention" : filter}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="min-w-0">
            <legend className="mb-2.5 text-xs font-extrabold text-foreground">A little something in common</legend>
            <div className="flex flex-wrap gap-2">
              <button
                aria-pressed={interest === null}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${interest === null ? "bg-[#f8e8e8] text-[#a54d5d]" : "bg-[#f7f5f8] text-muted hover:bg-coral-soft"}`}
                onClick={() => chooseInterest(null)}
                type="button"
              >
                Any interest
              </button>
              {interests.slice(0, 4).map((tag) => (
                <button
                  aria-pressed={interest === tag}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition ${interest === tag ? "bg-[#f8e8e8] text-[#a54d5d]" : "bg-[#f7f5f8] text-muted hover:bg-coral-soft"}`}
                  key={tag}
                  onClick={() => chooseInterest(tag)}
                  type="button"
                >
                  {tag}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      {feedback ? (
        <p aria-live="polite" className="rounded-2xl border border-[#eadff5] bg-violet-soft px-4 py-3 text-sm font-semibold text-violet" role="status">
          {feedback}
        </p>
      ) : null}

      {!profiles.length ? (
        <EmptyState
          description="Real discovery is unavailable until profile visibility, campus membership, mutual likes, and database access policies are built and reviewed. This production screen does not mix in demo profiles."
          symbol="✦"
          title="Discovery is getting ready"
        />
      ) : profile ? (
        <section aria-label="Fictional development profiles" className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
          <article className="overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_18px_55px_rgba(44,31,57,.08)]">
            <div className="grid md:grid-cols-[minmax(260px,.9fr)_minmax(300px,1fr)]">
              <div className="relative min-h-[340px] overflow-hidden bg-violet-soft sm:min-h-[450px] md:min-h-[560px]">
                <Image alt={`Illustrated fictional profile preview for ${profile.name}`} className="object-cover" fill priority sizes="(max-width: 768px) 100vw, 48vw" src={profile.illustration} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#281e35]/35 via-transparent to-[#281e35]/5" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/90 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-violet shadow-sm backdrop-blur">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-coral" />
                  Fictional preview
                </span>
                <span className="absolute bottom-4 left-4 rounded-full bg-[#241d2b]/55 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur">
                  Illustration · not a real student
                </span>
              </div>

              <div className="flex flex-col p-5 sm:p-7 lg:p-8">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-violet">A new campus hello</p>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.065em] sm:text-4xl">{profile.name}</h2>
                  </div>
                  <span className="shrink-0 rounded-full bg-coral-soft px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#b34e60]">{profile.intention}</span>
                </div>

                <p className="mt-2 text-xs font-semibold text-muted">{profile.campus}</p>
                <p className="mt-6 text-sm leading-7 text-[#514958]">{profile.biography}</p>

                <div className="mt-6">
                  <h3 className="text-xs font-extrabold">Things we could talk about</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profile.interests.map((tag) => <InterestTag key={tag} label={tag} />)}
                  </div>
                </div>

                <div className="mt-auto pt-8">
                  <p className="mb-3 text-center text-[10px] font-bold text-muted">These controls only preview the interaction. Likes and passes are not saved.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button aria-label={`Pass preview for ${profile.name}; not saved`} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-line bg-white text-sm font-extrabold text-[#746c79] transition hover:border-[#d3c9da] hover:bg-[#faf8fb]" onClick={() => previewAction("Pass")} type="button">
                      <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeLinecap="round" strokeWidth="2" /></svg>
                      Pass
                    </button>
                    <button aria-label={`Like preview for ${profile.name}; not saved`} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-coral text-sm font-extrabold text-white shadow-[0_8px_18px_rgba(239,113,130,.2)] transition hover:-translate-y-0.5 hover:bg-[#df6073]" onClick={() => previewAction("Like")} type="button">
                      <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20"><path d="M17.1 7.6c0 4-7.1 8-7.1 8s-7.1-4-7.1-8a3.4 3.4 0 0 1 7.1-.9 3.4 3.4 0 0 1 7.1.9Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /></svg>
                      Like
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <aside className="space-y-4">
            <div className="rounded-[24px] border border-[#eadff5] bg-[#f2ecfb] p-5">
              <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-violet">Fictional dev fixture</span>
              <h2 className="mt-4 text-lg font-extrabold tracking-[-0.04em]">A safe space to explore the idea.</h2>
              <p className="mt-2 text-xs leading-5 text-[#655c6c]">Every profile here is an illustration and invented copy used only in development. There are no real student profiles behind these cards.</p>
            </div>
            <div className="rounded-[24px] border border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold">Preview stack</h2>
                <span className="rounded-full bg-[#f7f5f8] px-2.5 py-1 text-[10px] font-bold text-muted">local only</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted">{Math.min(profileIndex + 1, filteredProfiles.length)} of {filteredProfiles.length} fictional cards in this filter.</p>
              <div aria-hidden="true" className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#eee9f1]">
                <span className="block h-full rounded-full bg-violet transition-all" style={{ width: `${Math.min(((profileIndex + 1) / filteredProfiles.length) * 100, 100)}%` }} />
              </div>
            </div>
            <div className="rounded-[24px] border border-line bg-white p-5">
              <h2 className="text-sm font-extrabold">Make your first impression</h2>
              <p className="mt-2 text-xs leading-5 text-muted">Profile setup is currently a local preview and nothing is stored.</p>
              <Link className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-violet hover:text-violet-dark" href="/profile">Preview your profile <span aria-hidden="true">→</span></Link>
            </div>
          </aside>
        </section>
      ) : (
        <EmptyState
          action={<button className="rounded-xl bg-violet px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-dark" onClick={() => { setProfileIndex(0); setFeedback(""); }} type="button">Reset preview</button>}
          description="The sample cards only move forward in this temporary preview. No like or pass was saved."
          symbol="♡"
          title={filteredProfiles.length ? "That’s everyone in this preview" : "No preview cards match those filters"}
        />
      )}
    </div>
  );
}
