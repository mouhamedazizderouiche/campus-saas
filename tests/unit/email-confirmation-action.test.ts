import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createClientMock, verifyOtpMock, redirectMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
  verifyOtpMock: vi.fn(),
  redirectMock: vi.fn(),
}));

vi.mock("@/src/lib/supabase/server", () => ({
  createClient: createClientMock,
  clearLocalSupabaseSessionCookies: vi.fn(),
}));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import { confirmEmailAction } from "@/src/features/auth/actions";

function confirmationForm(tokenHash: string, next = "/dashboard") {
  const formData = new FormData();
  formData.set("token_hash", tokenHash);
  formData.set("next", next);
  return formData;
}

describe("email confirmation action", () => {
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://campus123.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY =
      "sb_publishable_test-placeholder";
    redirectMock.mockReset().mockImplementation((path: string) => {
      throw new Error(`REDIRECT:${path}`);
    });
    verifyOtpMock.mockReset();
    createClientMock.mockReset().mockResolvedValue({
      auth: { verifyOtp: verifyOtpMock },
    });
  });

  afterEach(() => {
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey === undefined)
      delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = previousKey;
  });

  it("verifies a token hash, persists the session, and redirects internally", async () => {
    verifyOtpMock.mockResolvedValue({
      data: { session: { access_token: "test-access-token" } },
      error: null,
    });

    await expect(
      confirmEmailAction(confirmationForm("valid-one-time-hash")),
    ).rejects.toThrow("REDIRECT:/dashboard");

    expect(createClientMock).toHaveBeenCalledWith({
      requireCookieWrites: true,
    });
    expect(verifyOtpMock).toHaveBeenCalledWith({
      token_hash: "valid-one-time-hash",
      type: "email",
    });
  });

  it("fails closed for invalid or expired token hashes without exposing provider errors", async () => {
    verifyOtpMock.mockResolvedValue({
      error: new Error("otp_expired: private provider detail"),
    });

    await expect(
      confirmEmailAction(confirmationForm("expired-one-time-hash")),
    ).rejects.toThrow("REDIRECT:/sign-in?error=confirmation");
    expect(redirectMock.mock.calls[0][0]).not.toContain("private provider detail");
  });

  it("does not report success if verification returns no session", async () => {
    verifyOtpMock.mockResolvedValue({ data: { session: null }, error: null });

    await expect(
      confirmEmailAction(confirmationForm("valid-one-time-hash")),
    ).rejects.toThrow("REDIRECT:/sign-in?error=confirmation");
  });

  it("rejects unsafe post-confirmation redirects", async () => {
    verifyOtpMock.mockResolvedValue({
      data: { session: { access_token: "test-access-token" } },
      error: null,
    });

    await expect(
      confirmEmailAction(
        confirmationForm("valid-one-time-hash", "https://attacker.example"),
      ),
    ).rejects.toThrow("REDIRECT:/dashboard");
  });

  it("does not call Supabase when the token hash is missing", async () => {
    const formData = new FormData();
    formData.set("next", "/dashboard");

    await expect(confirmEmailAction(formData)).rejects.toThrow(
      "REDIRECT:/sign-in?error=confirmation",
    );
    expect(createClientMock).not.toHaveBeenCalled();
  });
});
