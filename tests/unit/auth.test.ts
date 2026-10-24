import { describe, expect, it } from "vitest";
import { signInSchema, signUpSchema } from "../../src/features/auth/schemas";
import {
  getSafeAuthErrorMessage,
  getSafeRedirectPath,
  getSafeSignOutFailureMessage,
  getSafeSignUpOperationFailure,
  getSafeSignUpProviderOutcome,
} from "../../src/features/auth/security";

describe("authentication input schemas", () => {
  it("accepts valid sign-up input and normalizes the email", () => {
    expect(
      signUpSchema.parse({ email: "  student@example.edu ", password: "campusPass8" }),
    ).toEqual({ email: "student@example.edu", password: "campusPass8" });
  });

  it("rejects malformed emails and short sign-up passwords", () => {
    const result = signUpSchema.safeParse({
      email: "not-an-email",
      password: "short",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });

  it("requires a password for sign-in", () => {
    expect(
      signInSchema.safeParse({ email: "student@example.edu", password: "" })
        .success,
    ).toBe(false);
  });
});

describe("safe authentication redirects", () => {
  it("keeps valid internal paths and query strings", () => {
    expect(getSafeRedirectPath("/dashboard?tab=home")).toBe(
      "/dashboard?tab=home",
    );
  });

  it.each([
    "https://attacker.example",
    "//attacker.example",
    "/\\attacker.example",
    "/%2F%2Fattacker.example",
    "/%5C%5Cattacker.example",
    "/%2e%2e//attacker.example",
    "/%ZZ",
    "/dashboard%2f..%2f..%2fattacker.example",
    "/dashboard?return=%ZZ",
    "/dashboard%00",
    "javascript:alert(1)",
    "relative/path",
  ])("rejects unsafe redirect %s", (value) => {
    expect(getSafeRedirectPath(value)).toBe("/dashboard");
  });
});

describe("safe provider errors", () => {
  it("does not expose provider details or account-existence hints", () => {
    const providerError = new Error(
      "User student@example.edu not found: token=private-value",
    );
    const message = getSafeAuthErrorMessage(providerError);

    expect(message).not.toContain("student@example.edu");
    expect(message).not.toContain("private-value");
    expect(message).toMatch(/Unable to sign in/);
  });

  it("keeps provider sign-up responses generic and neutral", () => {
    const accepted = getSafeSignUpProviderOutcome(null);
    const providerError = getSafeSignUpProviderOutcome(
      Object.assign(new Error("email already exists for student@example.edu"), {
        code: "user_already_exists",
        status: 422,
      }),
    );

    expect(accepted).toEqual(providerError);
    expect(providerError.status).toBe("notice");
    expect(providerError.message).not.toContain("student@example.edu");
  });

  it("reports sign-up transport failures as errors without exposing details", () => {
    const networkError = new Error("request to private-host failed");
    networkError.name = "AuthRetryableFetchError";
    const outcome = getSafeSignUpProviderOutcome(networkError);

    expect(outcome.status).toBe("error");
    expect(outcome.message).not.toContain("private-host");
    expect(outcome.message).not.toMatch(/send instructions/);
  });

  it("reports other provider failures as errors without exposing details", () => {
    const providerError = Object.assign(
      new Error("Supabase returned private diagnostic data"),
      { status: 503 },
    );
    const outcome = getSafeSignUpProviderOutcome(providerError);

    expect(outcome.status).toBe("error");
    expect(outcome.message).not.toContain("private diagnostic");
    expect(outcome.message).not.toMatch(/send instructions/);
  });

  it("reports a generic operation error instead of claiming sign-up succeeded", () => {
    const outcome = getSafeSignUpOperationFailure(
      new Error("Invalid Supabase key: sb_secret_private-value"),
    );

    expect(outcome.status).toBe("error");
    expect(outcome.message).not.toContain("sb_secret_private-value");
    expect(outcome.message).not.toMatch(/send instructions/);
  });

  it("warns when sign-out could not be confirmed", () => {
    expect(getSafeSignOutFailureMessage()).toMatch(/couldn’t confirm server-side sign-out/);
    expect(getSafeSignOutFailureMessage()).toMatch(/refresh token may remain usable/);
    expect(getSafeSignOutFailureMessage()).toMatch(/access token may remain valid/);
  });
});
