import { NextResponse, type NextRequest } from "next/server";
import { getAppBaseUrl } from "@/src/lib/env";
import { createClient } from "@/src/lib/supabase/server";
import { getSafeRedirectPath } from "@/src/features/auth/security";

function unavailable() {
  return new Response("Authentication is not configured.", {
    status: 503,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function GET(request: NextRequest) {
  let appBaseUrl: string;
  try {
    appBaseUrl = getAppBaseUrl(process.env.APP_URL);
  } catch {
    return unavailable();
  }

  const code = request.nextUrl.searchParams.get("code");
  const destination = getSafeRedirectPath(
    request.nextUrl.searchParams.get("next"),
  );

  if (code) {
    try {
      const supabase = await createClient({ requireCookieWrites: true });
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const response = NextResponse.redirect(
          new URL(destination, appBaseUrl),
          { status: 303 },
        );
        response.headers.set("Cache-Control", "private, no-store");
        return response;
      }
    } catch {
      // Provider details and one-time authorization codes stay out of the UI.
    }
  }

  const response = NextResponse.redirect(
    new URL("/sign-in?error=confirmation", appBaseUrl),
    { status: 303 },
  );
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
