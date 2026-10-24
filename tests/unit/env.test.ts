import { describe, expect, it } from "vitest";
import { getAppBaseUrl, getPublicSupabaseEnv } from "../../src/lib/env";

describe("getPublicSupabaseEnv", () => {
  it("reports missing variable names without exposing values", () => {
    expect(() => getPublicSupabaseEnv({})).toThrow(
      /NEXT_PUBLIC_SUPABASE_URL is required/,
    );
    expect(() => getPublicSupabaseEnv({})).toThrow(
      /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required/,
    );
  });

  it("rejects invalid URLs without echoing the supplied value", () => {
    const invalidUrl = "not-a-valid-url-secret";

    expect(() =>
      getPublicSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_URL: invalidUrl,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test-placeholder",
      }),
    ).toThrow(/NEXT_PUBLIC_SUPABASE_URL must be a valid http\(s\) URL/);
    expect(() =>
      getPublicSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_URL: invalidUrl,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test-placeholder",
      }),
    ).not.toThrow(invalidUrl);
  });

  it("accepts a valid URL and a publishable key", () => {
    expect(
      getPublicSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://campus.example.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test-placeholder",
      }),
    ).toEqual({
      url: "https://campus.example.supabase.co",
      publishableKey: "sb_publishable_test-placeholder",
    });
  });

  it("rejects legacy or unexpected key formats", () => {
    const invalidKey = "secret-looking-placeholder";
    let errorMessage = "";

    try {
      getPublicSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://campus.example.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: invalidKey,
      });
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "";
    }

    expect(errorMessage).toContain("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    expect(errorMessage).not.toContain(invalidKey);
    expect(() =>
      getPublicSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://campus.example.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "legacy-anon-key",
      }),
    ).toThrow(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  });
});

describe("getAppBaseUrl", () => {
  it("accepts a trusted application origin", () => {
    expect(getAppBaseUrl("https://campus.example")).toBe(
      "https://campus.example",
    );
  });

  it("rejects missing and invalid application URLs", () => {
    expect(() => getAppBaseUrl(undefined)).toThrow(
      /APP_URL is required/,
    );

    expect(() => getAppBaseUrl("javascript:private-value")).toThrow(
      /valid http\(s\) URL/,
    );

    expect(
      () => getAppBaseUrl("https://user:password@campus.example"),
    ).toThrow(/valid http\(s\) URL/);

    expect(() => getAppBaseUrl("https://campus.example/app")).toThrow(
      /valid http\(s\) URL/,
    );
  });
});