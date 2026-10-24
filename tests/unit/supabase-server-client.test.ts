import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  createServerClientMock,
  clearAuthCookiesAtScopesMock,
  cookieStoreMock,
  cookiesMock,
} = vi.hoisted(() => ({
  createServerClientMock: vi.fn(),
  clearAuthCookiesAtScopesMock: vi.fn(),
  cookieStoreMock: {
    getAll: vi.fn(() => [{ name: "session", value: "current" }]),
    set: vi.fn(),
  },
  cookiesMock: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@supabase/ssr", () => ({
  createServerClient: createServerClientMock,
  clearAuthCookiesAtScopes: clearAuthCookiesAtScopesMock,
}));
vi.mock("next/headers", () => ({ cookies: cookiesMock }));

import { createClient } from "../../src/lib/supabase/server";

describe("request-scoped Supabase server client", () => {
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://campus123.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY =
      "sb_publishable_test-placeholder";
    cookieStoreMock.getAll.mockReturnValue([
      { name: "session", value: "current" },
    ]);
    cookieStoreMock.set.mockReset();
    cookiesMock.mockReset().mockResolvedValue(cookieStoreMock);
    createServerClientMock.mockReset().mockReturnValue({});
  });

  afterEach(() => {
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey === undefined)
      delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = previousKey;
  });

  it("creates a fresh cookie-backed client for each request", async () => {
    await createClient();
    await createClient();

    expect(cookiesMock).toHaveBeenCalledTimes(2);
    const [, , options] = createServerClientMock.mock.calls[0];
    expect(options.cookies.getAll()).toEqual([
      { name: "session", value: "current" },
    ]);
  });

  it("suppresses cookie write errors by default for Server Components", async () => {
    cookieStoreMock.set.mockImplementation(() => {
      const error = new Error(
        "Cookies can only be modified in a Server Action or Route Handler.",
      );
      error.name = "ReadonlyRequestCookiesError";
      throw error;
    });
    await createClient();
    const [, , options] = createServerClientMock.mock.calls[0];

    expect(() =>
      options.cookies.setAll([
        { name: "session", value: "next", options: { path: "/" } },
      ]),
    ).not.toThrow();
  });

  it("propagates cookie write errors when required by an action or route", async () => {
    cookieStoreMock.set.mockImplementation(() => {
      throw new Error("cookie writes are unavailable");
    });
    await createClient({ requireCookieWrites: true });
    const [, , options] = createServerClientMock.mock.calls[0];

    expect(() =>
      options.cookies.setAll([
        { name: "session", value: "next", options: { path: "/" } },
      ]),
    ).toThrow("cookie writes are unavailable");
  });

  it("does not hide unexpected cookie-store errors when writes are optional", async () => {
    cookieStoreMock.set.mockImplementation(() => {
      throw new Error("cookie store failed unexpectedly");
    });
    await createClient();
    const [, , options] = createServerClientMock.mock.calls[0];

    expect(() =>
      options.cookies.setAll([
        { name: "session", value: "next", options: { path: "/" } },
      ]),
    ).toThrow("cookie store failed unexpectedly");
  });
});
