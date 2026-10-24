"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  signInAction,
  signUpAction,
} from "@/src/features/auth/actions";
import { CompuceLogo } from "@/src/components/shared/compuce-logo";

const initialAuthFormState = { status: "idle" as const };

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
  redirectTo?: string;
  notice?: string;
};

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p className="text-sm text-red-700 dark:text-red-300" id={id}>
      {message}
    </p>
  ) : null;
}

export function AuthForm({ mode, redirectTo = "/dashboard", notice }: AuthFormProps) {
  const action = mode === "sign-in" ? signInAction : signUpAction;
  const [state, formAction, pending] = useActionState(
    action,
    initialAuthFormState,
  );
  const isSignIn = mode === "sign-in";
  const emailError = state.fieldErrors?.email?.[0];
  const passwordError = state.fieldErrors?.password?.[0];

  return (
    <section className="w-full max-w-[460px] rounded-[30px] border border-white bg-white p-6 shadow-[0_24px_75px_rgba(44,31,57,.1)] sm:p-9">
      <Link aria-label="Compuce home" className="inline-flex rounded-xl" href="/"><CompuceLogo /></Link>
      <p className="mt-8 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet">
        {isSignIn ? "Good to see you again" : "Your campus, closer"}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.06em] sm:text-4xl">
        {isSignIn ? "Welcome back." : "Find your people."}
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        {isSignIn
          ? "Sign in to pick up where your campus story starts."
          : "We’ll email you instructions if this address can be registered."}
      </p>

      {notice ? (
        <p className="mt-5 rounded-2xl border border-[#eadff5] bg-violet-soft p-3.5 text-sm text-violet" role="status">
          {notice}
        </p>
      ) : null}

      {state.message ? (
        <p
          className={`mt-5 rounded-md p-3 text-sm ${
            state.status === "notice"
            ? "border border-[#eadff5] bg-violet-soft text-violet"
              : "border border-[#f1c8cd] bg-coral-soft text-[#9f3e50]"
          }`}
          aria-live={state.status === "error" ? "assertive" : "polite"}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      ) : null}

      <form action={formAction} className="mt-7 space-y-5">
        {isSignIn ? (
          <input name="next" type="hidden" value={redirectTo} />
        ) : null}
        <div className="space-y-2">
            <label className="block text-xs font-extrabold" htmlFor={`${mode}-email`}>
            Email address
          </label>
          <input
            aria-describedby={emailError ? `${mode}-email-error` : undefined}
            aria-invalid={Boolean(emailError)}
            autoComplete="email"
            className="w-full rounded-xl border border-line bg-[#fcfbfc] px-3.5 py-3 text-sm outline-none transition placeholder:text-[#aaa2ad] focus:border-violet"
            id={`${mode}-email`}
            name="email"
            required
            type="email"
          />
          <FieldError id={`${mode}-email-error`} message={emailError} />
        </div>

        <div className="space-y-2">
            <label className="block text-xs font-extrabold" htmlFor={`${mode}-password`}>
            Password
          </label>
          <input
            aria-describedby={passwordError ? `${mode}-password-error` : undefined}
            aria-invalid={Boolean(passwordError)}
            autoComplete={isSignIn ? "current-password" : "new-password"}
            className="w-full rounded-xl border border-line bg-[#fcfbfc] px-3.5 py-3 text-sm outline-none transition placeholder:text-[#aaa2ad] focus:border-violet"
            id={`${mode}-password`}
            maxLength={128}
            minLength={isSignIn ? undefined : 8}
            name="password"
            required
            type="password"
          />
          <FieldError id={`${mode}-password-error`} message={passwordError} />
          {!isSignIn ? (
            <p className="text-[11px] text-muted">
              Use at least 8 characters.
            </p>
          ) : null}
        </div>

        <button
          className="w-full rounded-2xl bg-violet px-4 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-violet-dark disabled:cursor-not-allowed disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          {pending
            ? isSignIn
              ? "Signing in…"
              : "Creating account…"
            : isSignIn
              ? "Sign in"
              : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        {isSignIn ? "New to Campus SaaS? " : "Already registered? "}
        <Link
          className="font-extrabold text-violet underline decoration-violet/30 underline-offset-4 hover:text-violet-dark"
          href={isSignIn ? "/sign-up" : "/sign-in"}
        >
          {isSignIn ? "Create an account" : "Sign in"}
        </Link>
      </p>
      <p className="mt-7 border-t border-line pt-5 text-center text-[10px] leading-5 text-muted">
        Compuce is an early preview. Matching and messaging are not connected to a backend yet.
      </p>
    </section>
  );
}
