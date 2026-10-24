import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicSupabaseEnv } from "@/src/lib/env";
import { clearSupabaseAuthCookies } from "@/src/lib/supabase/cookies";

function isReadOnlyServerComponentCookieError(error: unknown) {
  return (
    error instanceof Error &&
    (error.name === "ReadonlyRequestCookiesError" ||
      error.message.startsWith(
        "Cookies can only be modified in a Server Action or Route Handler.",
      ))
  );
}

/** Create a request-scoped server client backed by the incoming Next.js cookies. */
export async function createClient(
  options: { requireCookieWrites?: boolean } = {},
) {
  const { url, publishableKey } = getPublicSupabaseEnv({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        if (options.requireCookieWrites) {
          cookiesToSet.forEach(({ name, value, options: cookieOptions }) => {
            cookieStore.set(name, value, cookieOptions);
          });
          return;
        }

        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          // Only ignore Next.js's read-only Server Component cookie error.
          // Unexpected write failures must remain visible to the caller.
          if (!isReadOnlyServerComponentCookieError(error)) throw error;
        }
      },
    },
  });
}

/** Clear the current request's Supabase session cookies as a sign-out fallback. */
export async function clearLocalSupabaseSessionCookies() {
  const { url } = getPublicSupabaseEnv({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
  const cookieStore = await cookies();

  await clearSupabaseAuthCookies({
    projectUrl: url,
    getAll: async () => cookieStore.getAll(),
    setAll: async (cookiesToSet) => {
      cookiesToSet.forEach(({ name, value, options }) => {
        cookieStore.set(name, value, options);
      });
    },
  });
}
