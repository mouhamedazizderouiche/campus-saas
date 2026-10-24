import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { createClientMock, exchangeCodeMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
  exchangeCodeMock: vi.fn(),
}));

vi.mock("../../src/lib/supabase/server", () => ({
  createClient: createClientMock,
}));

import { GET } from "../../app/auth/callback/route";

describe("email confirmation callback", () => {
  const previousAppUrl = process.env.APP_URL;

  beforeEach(() => {
    process.env.APP_URL = "https://campus.example";
    createClientMock.mockReset();
    exchangeCodeMock.mockReset();
    createClientMock.mockResolvedValue({
      auth: { exchangeCodeForSession: exchangeCodeMock },
    });
  });

  afterEach(() => {
    if (previousAppUrl === undefined) delete process.env.APP_URL;
    else process.env.APP_URL = previousAppUrl;
  });

  it("exchanges the code and redirects to a safe internal path without caching", async () => {
    exchangeCodeMock.mockResolvedValue({ error: null });
    const request = new NextRequest(
      "https://campus.example/auth/callback?code=one-time-code&next=%2Fdashboard%3Ftab%3Dhome",
    );

    const response = await GET(request);

    expect(exchangeCodeMock).toHaveBeenCalledWith("one-time-code");
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://campus.example/dashboard?tab=home",
    );
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it("uses a same-origin sign-in destination when exchange fails", async () => {
    exchangeCodeMock.mockResolvedValue({
      error: new Error("private provider diagnostic"),
    });
    const request = new NextRequest(
      "https://campus.example/auth/callback?code=bad-code&next=https%3A%2F%2Fevil.example",
    );

    const response = await GET(request);

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://campus.example/sign-in?error=confirmation",
    );
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it("fails without exposing provider data when the code is missing", async () => {
    const request = new NextRequest(
      "https://campus.example/auth/callback?next=%2Fdashboard",
    );

    const response = await GET(request);

    expect(createClientMock).not.toHaveBeenCalled();
    expect(response.headers.get("location")).toBe(
      "https://campus.example/sign-in?error=confirmation",
    );
  });
});
