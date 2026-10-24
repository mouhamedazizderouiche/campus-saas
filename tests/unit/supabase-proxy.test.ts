import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { createServerClientMock } = vi.hoisted(() => ({
  createServerClientMock: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: createServerClientMock,
}));

import { updateSession } from "../../src/lib/supabase/proxy";

describe("Supabase session Proxy", () => {
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://campus123.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY =
      "sb_publishable_test-placeholder";
    createServerClientMock.mockReset();
  });

  afterEach(() => {
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey === undefined)
      delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = previousKey;
  });

  it("forwards every refreshed cookie to the request and response and retains no-store headers", async () => {
    createServerClientMock.mockImplementation((_url, _key, options) => ({
      auth: {
        getClaims: async () => {
          options.cookies.setAll(
            [
              {
                name: "sb-session.0",
                value: "chunk-zero",
                options: { httpOnly: true, path: "/" },
              },
              {
                name: "sb-session.1",
                value: "chunk-one",
                options: { httpOnly: true, path: "/" },
              },
            ],
            { "Cache-Control": "private, no-cache, no-store, max-age=0" },
          );
          options.cookies.setAll(
            [{ name: "sb-session.0", value: "new-zero", options: { path: "/" } }],
            {},
          );
          return { data: { claims: null }, error: null };
        },
      },
    }));
    const request = new NextRequest("https://campus.example/dashboard");

    const response = await updateSession(request);

    expect(request.cookies.get("sb-session.0")?.value).toBe("new-zero");
    expect(request.cookies.get("sb-session.1")?.value).toBe("chunk-one");
    expect(response.cookies.get("sb-session.0")?.value).toBe("new-zero");
    expect(response.cookies.get("sb-session.1")?.value).toBe("chunk-one");
    expect(response.headers.get("cache-control")).toBe(
      "private, no-cache, no-store, max-age=0",
    );
  });

  it("prevents caching and referrer leakage on the token confirmation page", async () => {
    const request = new NextRequest(
      "https://campus.example/auth/confirm?token_hash=one-time-hash&type=email",
    );

    const response = await updateSession(request);

    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
  });
});
