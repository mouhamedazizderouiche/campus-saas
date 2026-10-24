"use server";

import { redirect } from "next/navigation";
import { getAppBaseUrl, getPublicSupabaseEnv } from "@/src/lib/env";
import {
  clearLocalSupabaseSessionCookies,
  createClient,
} from "@/src/lib/supabase/server";
import {
  confirmEmailSchema,
  signInSchema,
  signUpSchema,
  type AuthFormState,
} from "@/src/features/auth/schemas";
import {
  getSafeAuthErrorMessage,
  getSafeRedirectPath,
  getSafeSignUpOperationFailure,
  getSafeSignUpProviderOutcome,
} from "@/src/features/auth/security";

const CONFIGURATION_MESSAGE =
  "Authentication is not configured. Set the Supabase URL and publishable key in .env.local; sign-up confirmation also needs APP_URL.";

export async function confirmEmailAction(formData: FormData): Promise<void> {
  const input = confirmEmailSchema.safeParse({
    token_hash: formData.get("token_hash"),
    next: formData.get("next"),
  });

  if (!input.success) redirect("/sign-in?error=confirmation");

  let verified = false;
  try {
    const supabase = await createClient({ requireCookieWrites: true });
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: input.data.token_hash,
      type: "email",
    });
    verified = !error && Boolean(data.session);
  } catch {
    // Invalid/expired tokens and provider details stay out of the URL and UI.
  }

  if (!verified) redirect("/sign-in?error=confirmation");
  redirect(getSafeRedirectPath(input.data.next));
}

function hasValidSupabaseConfiguration() {
  try {
    getPublicSupabaseEnv({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    });
    return true;
  } catch {
    return false;
  }
}

export async function signUpAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const input = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!input.success) {
    return {
      status: "error",
      message: "Correct the highlighted fields and try again.",
      fieldErrors: input.error.flatten().fieldErrors,
    };
  }

  if (!hasValidSupabaseConfiguration()) {
    return { status: "error", message: CONFIGURATION_MESSAGE };
  }

  let appBaseUrl: string;
  try {
    appBaseUrl = getAppBaseUrl(process.env.APP_URL);
  } catch {
    return {
      status: "error",
      message: "Sign-up email confirmation needs a valid APP_URL in .env.local.",
    };
  }

  try {
    const supabase = await createClient({ requireCookieWrites: true });
    const { data, error } = await supabase.auth.signUp({
      email: input.data.email,
      password: input.data.password,
      options: {
        emailRedirectTo: `${appBaseUrl}/auth/callback?next=%2Fdashboard`,
      },
    });

    // Supabase may return a session when email confirmation is disabled.
    // Do not treat sign-up as proof of a confirmed account or log the user in.
    if (data.session) {
      try {
        const { error: signOutError } = await supabase.auth.signOut({
          scope: "local",
        });
        if (signOutError) await clearLocalSupabaseSessionCookies();
      } catch {
        await clearLocalSupabaseSessionCookies();
      }
    }

    return getSafeSignUpProviderOutcome(error);
  } catch (error) {
    return getSafeSignUpOperationFailure(error);
  }
}

export async function signInAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const input = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });

  if (!input.success) {
    return {
      status: "error",
      message: "Correct the highlighted fields and try again.",
      fieldErrors: input.error.flatten().fieldErrors,
    };
  }

  if (!hasValidSupabaseConfiguration()) {
    return { status: "error", message: CONFIGURATION_MESSAGE };
  }

  try {
    const supabase = await createClient({ requireCookieWrites: true });
    const { error } = await supabase.auth.signInWithPassword({
      email: input.data.email,
      password: input.data.password,
    });

    if (error) {
      return {
        status: "error",
        message: getSafeAuthErrorMessage(error),
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: getSafeAuthErrorMessage(error),
    };
  }

  redirect(getSafeRedirectPath(input.data.next));
}

export async function signOutAction() {
  if (!hasValidSupabaseConfiguration()) {
    redirect("/sign-in?error=signout");
  }

  let signOutFailed = false;
  try {
    const supabase = await createClient({ requireCookieWrites: true });
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      signOutFailed = true;
      await clearLocalSupabaseSessionCookies();
    }
  } catch {
    signOutFailed = true;
    try {
      await clearLocalSupabaseSessionCookies();
    } catch {
      // The sign-in page will warn that this browser may still be signed in.
    }
  }

  redirect(signOutFailed ? "/sign-in?error=signout" : "/");
}
