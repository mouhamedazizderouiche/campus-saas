import { Suspense } from "react";
import { AuthForm } from "@/src/features/auth/auth-form";
import {
  getSafeRedirectPath,
  getSafeSignOutFailureMessage,
} from "@/src/features/auth/security";

type SignInSearchParams = Promise<{
  next?: string | string[];
  error?: string | string[];
}>;

export default function SignInPage({
  searchParams,
}: {
  searchParams: SignInSearchParams;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 sm:px-8">
      <div aria-hidden="true" className="absolute -left-32 top-16 size-72 rounded-full bg-[#e9def7] blur-3xl" />
      <div aria-hidden="true" className="absolute -right-28 bottom-12 size-72 rounded-full bg-[#f9dedf] blur-3xl" />
      <Suspense
        fallback={
          <div aria-label="Loading sign-in form" className="relative h-[520px] w-full max-w-[460px] animate-pulse rounded-[30px] bg-white/80" />
        }
      >
        <SignInContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function SignInContent({
  searchParams,
}: {
  searchParams: SignInSearchParams;
}) {
  const params = await searchParams;
  const next = Array.isArray(params.next) ? params.next[0] : params.next;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <AuthForm
      mode="sign-in"
      redirectTo={getSafeRedirectPath(next)}
      notice={
        error === "confirmation"
          ? "That confirmation link could not be completed. Request a new sign-up link and try again."
          : error === "signout"
            ? getSafeSignOutFailureMessage()
            : undefined
      }
    />
  );
}
