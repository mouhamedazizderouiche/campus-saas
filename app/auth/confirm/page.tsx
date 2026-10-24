import { Suspense } from "react";
import Link from "next/link";
import { CompuceLogo } from "@/src/components/shared/compuce-logo";
import { confirmEmailAction } from "@/src/features/auth/actions";
import { getSafeRedirectPath } from "@/src/features/auth/security";

type ConfirmationSearchParams = Promise<{
  token_hash?: string | string[];
  next?: string | string[];
}>;

export default function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: ConfirmationSearchParams;
}) {
  return (
    <main className="relative flex min-h-screen justify-center overflow-hidden px-5 py-12 sm:px-8">
      <div aria-hidden="true" className="absolute -left-32 top-16 size-72 rounded-full bg-[#e9def7] blur-3xl" />
      <div aria-hidden="true" className="absolute -right-28 bottom-12 size-72 rounded-full bg-[#f9dedf] blur-3xl" />
      <Suspense
        fallback={
          <section
            aria-label="Loading confirmation"
            className="relative mt-12 h-64 w-full max-w-md animate-pulse rounded-[28px] bg-white/80"
          />
        }
      >
        <ConfirmationContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function ConfirmationContent({
  searchParams,
}: {
  searchParams: ConfirmationSearchParams;
}) {
  const params = await searchParams;
  const rawTokenHash = Array.isArray(params.token_hash)
    ? params.token_hash[0]
    : params.token_hash;
  const tokenHash =
    typeof rawTokenHash === "string" && rawTokenHash.trim().length <= 2048
      ? rawTokenHash.trim()
      : "";
  const rawNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const next = getSafeRedirectPath(rawNext);

  return (
    <section className="relative mt-12 w-full max-w-md rounded-[28px] border border-white bg-white p-7 shadow-[0_24px_75px_rgba(44,31,57,.1)] sm:p-9">
      <Link aria-label="Compuce home" className="inline-flex rounded-xl" href="/"><CompuceLogo /></Link>
      <h1 className="mt-8 text-2xl font-extrabold tracking-[-0.05em]">Confirm your email</h1>
      {tokenHash ? (
        <>
          <p className="mt-3 text-sm leading-6 text-muted">
            Press the button to confirm your address and finish signing in.
          </p>
          <form action={confirmEmailAction} className="mt-6">
            <input name="token_hash" type="hidden" value={tokenHash} />
            <input name="next" type="hidden" value={next} />
            <button
              className="w-full rounded-2xl bg-violet px-4 py-3.5 text-sm font-extrabold text-white hover:bg-violet-dark"
              type="submit"
            >
              Confirm email
            </button>
          </form>
        </>
      ) : (
        <>
          <p className="mt-3 text-sm leading-6 text-muted">
            This confirmation link is invalid or expired. Request a new sign-up
            email and try again.
          </p>
          <Link
            className="mt-5 inline-block font-extrabold text-violet underline underline-offset-4"
            href="/sign-up"
          >
            Return to sign-up
          </Link>
        </>
      )}
    </section>
  );
}
