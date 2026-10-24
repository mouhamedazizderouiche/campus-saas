import "server-only";

import { connection } from "next/server";
import { hasPublicSupabaseEnv } from "@/src/lib/env";
import { createClient } from "@/src/lib/supabase/server";

export type AuthenticatedUser = {
  id: string;
  email: string | null;
};

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  // Auth state depends on the incoming request and must never be prerendered.
  await connection();

  if (
    !hasPublicSupabaseEnv({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    })
  ) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    const claims = data?.claims;
    const id = claims?.sub;

    if (error || typeof id !== "string") return null;

    return {
      id,
      email: typeof claims?.email === "string" ? claims.email : null,
    };
  } catch {
    return null;
  }
}
