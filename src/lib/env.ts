import { z } from "zod";

const requiredValue = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.string().min(1, "is required"),
);

const publicSupabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: requiredValue.refine(
    (value) => {
      try {
        const protocol = new URL(value).protocol;
        return protocol === "https:" || protocol === "http:";
      } catch {
        return false;
      }
    },
    "must be a valid http(s) URL",
  ),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: requiredValue.refine(
    (value) => value.startsWith("sb_publishable_"),
    "must be a Supabase publishable key beginning with sb_publishable_",
  ),
});

export type PublicSupabaseEnvironmentInput = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
};

/** Validate public Supabase settings without including their values in errors. */
export function getPublicSupabaseEnv(environment: PublicSupabaseEnvironmentInput) {
  const result = publicSupabaseEnvSchema.safeParse(environment);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${String(issue.path[0])} ${issue.message}`)
      .join("; ");

    throw new Error(`Invalid public Supabase environment: ${details}`);
  }

  return {
    url: result.data.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: result.data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}
