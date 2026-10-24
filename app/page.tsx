import Image from "next/image";
import Link from "next/link";
import { CompuceLogo } from "@/src/components/shared/compuce-logo";

const connectionWays = [
  {
    number: "01",
    title: "A good date",
    description: "Meet someone who makes your campus feel a little smaller.",
    tone: "bg-coral-soft text-[#b44d60]",
  },
  {
    number: "02",
    title: "A new friend",
    description: "Find your people for study breaks, late lunches, and everything between.",
    tone: "bg-mint text-[#387e61]",
  },
  {
    number: "03",
    title: "See where it goes",
    description: "Choose both when you are open to meeting someone either way.",
    tone: "bg-violet-soft text-violet",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link aria-label="Compuce home" className="rounded-xl" href="/">
          <CompuceLogo />
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-3 sm:gap-6">
          <Link className="hidden text-sm font-semibold text-muted transition hover:text-foreground sm:inline" href="#how-it-feels">
            The idea
          </Link>
          <Link className="rounded-xl px-3 py-2 text-sm font-bold text-foreground transition hover:bg-white" href="/sign-in">
            Sign in
          </Link>
          <Link className="rounded-xl bg-violet px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-violet-dark" href="/sign-up">
            Join Compuce <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-[1440px] items-center gap-10 px-5 pb-16 pt-8 sm:px-8 sm:pt-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:px-12 lg:pb-24 lg:pt-10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet/10 bg-white/75 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-violet shadow-sm">
            <span aria-hidden="true" className="size-2 rounded-full bg-coral" />
            For your campus chapter
          </div>
          <h1 className="mt-7 max-w-2xl text-[clamp(3.3rem,8vw,6.35rem)] font-extrabold leading-[0.94] tracking-[-0.075em] text-foreground">
            Your campus, <span className="text-violet">closer.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted sm:text-xl sm:leading-9">
            More than a swipe. A softer way to find your people—whether you are here for dating, friendship, or both.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link className="group inline-flex items-center gap-3 rounded-2xl bg-violet px-6 py-4 font-bold text-white shadow-[0_12px_28px_rgba(91,53,165,.22)] transition hover:-translate-y-0.5 hover:bg-violet-dark" href="/sign-up">
              Create your account
              <span aria-hidden="true" className="transition group-hover:translate-x-0.5">→</span>
            </Link>
            <span className="px-2 text-sm font-medium text-muted">A new kind of campus social</span>
          </div>
          <div className="mt-9 flex items-center gap-3 text-sm text-muted">
            <span aria-hidden="true" className="flex -space-x-2">
              <span className="grid size-8 place-items-center rounded-full border-2 border-background bg-[#f4cdbf] text-xs font-bold text-[#7d4b42]">D</span>
              <span className="grid size-8 place-items-center rounded-full border-2 border-background bg-[#dcd2f2] text-xs font-bold text-violet">F</span>
              <span className="grid size-8 place-items-center rounded-full border-2 border-background bg-[#d8eadc] text-xs font-bold text-[#39735a]">B</span>
            </span>
            <span><strong className="text-foreground">Dating. Friendship. Both.</strong><br className="sm:hidden" /> Your pace, your choice.</span>
          </div>
        </div>

        <div aria-label="Fictional Compuce design preview" className="relative mx-auto w-full max-w-[570px] pb-5 sm:pb-8">
          <div aria-hidden="true" className="absolute -right-8 top-4 size-56 rounded-full bg-[#e5dcf6] blur-3xl sm:-right-12 sm:size-72" />
          <div aria-hidden="true" className="absolute -bottom-4 -left-8 size-48 rounded-full bg-[#f9d9d9] blur-3xl sm:size-64" />
          <div className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white p-3 shadow-[0_30px_90px_rgba(58,37,80,.17)] sm:rotate-[1.5deg] sm:p-4">
            <div className="relative aspect-[0.94] overflow-hidden rounded-[26px] bg-[#e8e0f5] sm:aspect-[1.06]">
              <Image alt="Colorful illustration for a fictional Compuce profile preview" className="h-full w-full object-cover" fill priority sizes="(max-width: 768px) 90vw, 520px" src="/illustrations/portrait-sage.svg" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20172d]/80 via-transparent to-[#20172d]/10" />
              <div className="absolute left-5 top-5 rounded-full border border-white/40 bg-[#241d2b]/25 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                Fictional preview
              </div>
              <div className="absolute right-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-violet">
                open to both
              </div>
              <div className="absolute inset-x-6 bottom-6 text-white sm:inset-x-8 sm:bottom-8">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">Illustrated demo profile</p>
                <h2 className="mt-2 text-4xl font-extrabold tracking-[-0.06em] sm:text-5xl">A little more <span className="text-[#ffb5bd]">you.</span></h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/85">A space to meet campus people with the same kind of maybe.</p>
                <div className="mt-5 flex gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">coffee walks</span>
                  <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">good playlists</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-2 pb-1 pt-4 sm:px-3">
              <div>
                <p className="text-sm font-extrabold">Meet with intention</p>
                <p className="mt-1 text-xs text-muted">A product preview · nothing here is a real profile</p>
              </div>
              <span aria-hidden="true" className="grid size-11 place-items-center rounded-2xl bg-coral-soft text-xl text-coral">♡</span>
            </div>
          </div>
          <div className="absolute -left-1 bottom-1 hidden items-center gap-2 rounded-2xl border border-white bg-white px-4 py-3 shadow-[0_14px_35px_rgba(40,25,50,.1)] sm:flex">
            <span aria-hidden="true" className="grid size-8 place-items-center rounded-xl bg-violet-soft text-violet">✦</span>
            <span className="text-xs font-bold">Here for your kind of connection</span>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white/70" id="how-it-feels">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-violet">Connection, your way</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.055em] sm:text-4xl">Different reasons. Same campus.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted">Compuce is building a thoughtful place for meeting people. Matching, messaging, and saved profiles are not connected yet.</p>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {connectionWays.map((way) => (
              <article className="rounded-[24px] border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(40,25,50,.07)]" key={way.number}>
                <span className={`grid size-10 place-items-center rounded-2xl text-xs font-extrabold ${way.tone}`}>{way.number}</span>
                <h3 className="mt-6 text-xl font-extrabold tracking-[-0.035em]">{way.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{way.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-5 py-7 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <Link aria-label="Compuce home" className="w-fit" href="/"><CompuceLogo compact /></Link>
        <p>Designed for belonging. Built with care.</p>
        <Link className="font-bold text-violet hover:text-violet-dark" href="/sign-up">Join the preview →</Link>
      </footer>
    </main>
  );
}
