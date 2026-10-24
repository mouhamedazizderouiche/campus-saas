import { describe, expect, it } from "vitest";
import { clearSupabaseAuthCookies } from "../../src/lib/supabase/cookies";

describe("Supabase auth cookie cleanup", () => {
  it("clears every auth cookie chunk for the default project storage key and path", async () => {
    const cookieStore = [
      { name: "sb-campus123-auth-token.0", value: "chunk-a" },
      { name: "sb-campus123-auth-token.1", value: "chunk-b" },
      { name: "unrelated-cookie", value: "keep" },
    ];
    const written: Array<{
      name: string;
      value: string;
      options: { maxAge?: number; path?: string };
    }> = [];

    await clearSupabaseAuthCookies({
      projectUrl: "https://campus123.supabase.co",
      getAll: () => cookieStore,
      setAll: (cookies) => {
        written.push(...cookies);
      },
    });

    expect(written).toHaveLength(2);
    expect(written.map(({ name }) => name)).toEqual([
      "sb-campus123-auth-token.0",
      "sb-campus123-auth-token.1",
    ]);
    expect(written.every(({ value }) => value === "")).toBe(true);
    expect(written.every(({ options }) => options.maxAge === 0)).toBe(true);
    expect(written.every(({ options }) => options.path === "/")).toBe(true);
  });

  it("does not change unrelated cookies", async () => {
    const written: unknown[] = [];

    await clearSupabaseAuthCookies({
      projectUrl: "https://campus123.supabase.co",
      getAll: () => [{ name: "theme", value: "dark" }],
      setAll: (cookies) => {
        written.push(...cookies);
      },
    });

    expect(written).toEqual([]);
  });
});
