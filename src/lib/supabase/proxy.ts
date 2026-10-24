import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicSupabaseEnv, hasPublicSupabaseEnv } from "@/src/lib/env";

export async function updateSession(request: NextRequest) {
  const nextResponse = () => {
    const response = NextResponse.next({ request });
    if (request.nextUrl.pathname === "/auth/confirm") {
      response.headers.set("Cache-Control", "private, no-store");
      response.headers.set("Referrer-Policy", "no-referrer");
    }
    return response;
  };

  if (
    !hasPublicSupabaseEnv({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    })
  ) {
    return nextResponse();
  }

  const { url, publishableKey } = getPublicSupabaseEnv({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  let response = nextResponse();
  const responseCookies = new Map<
    string,
    { name: string; value: string; options?: CookieOptions }
  >();
  const responseHeaders = new Map<string, string>();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, cacheHeaders) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        cookiesToSet.forEach((cookie) => {
          const scope = `${cookie.name};${cookie.options?.domain ?? ""};${cookie.options?.path ?? "/"}`;
          responseCookies.set(scope, cookie);
        });
        Object.entries(cacheHeaders ?? {}).forEach(([name, value]) => {
          responseHeaders.set(name, value);
        });

        response = nextResponse();
        responseCookies.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        responseHeaders.forEach((value, name) => {
          response.headers.set(name, value);
        });
      },
    },
  });

  // This verifies the token and refreshes it when necessary. Never trust a
  // session read from cookies alone to authorize a protected page.
  try {
    await supabase.auth.getClaims();
  } catch {
    // Keep public routes available during transient Auth/JWKS network failures.
    // Protected pages independently fail closed when claim verification fails.
  }

  return response;
}
