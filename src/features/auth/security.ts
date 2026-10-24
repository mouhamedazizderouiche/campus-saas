export type SafeSignUpOutcome = {
  status: "notice" | "error";
  message: string;
};

export function getSafeAuthErrorMessage(providerError: unknown) {
  // Deliberately discard provider details; they may contain account or token data.
  void providerError;
  return "Unable to sign in with those details. Check your email and password and try again.";
}

export function getSafeSignUpProviderOutcome(
  providerError: unknown,
): SafeSignUpOutcome {
  const genericNotice: SafeSignUpOutcome = {
    status: "notice",
    message:
      "If this address can be registered, we’ll send instructions to its inbox.",
  };

  if (providerError === null || providerError === undefined) return genericNotice;

  const error = providerError as {
    name?: unknown;
    code?: unknown;
    message?: unknown;
    status?: unknown;
  };
  const code = typeof error.code === "string" ? error.code : "";
  const message = typeof error.message === "string" ? error.message : "";

  // Supabase may report an existing address differently; keep that case
  // indistinguishable from an accepted request to reduce account enumeration.
  if (
    code === "user_already_exists" ||
    /already (registered|exists)|user exists/i.test(message)
  ) {
    return genericNotice;
  }

  // Transport and other provider failures must not look like successful signup.
  return getSafeSignUpOperationFailure(providerError);
}

export function getSafeSignUpOperationFailure(
  operationError: unknown,
): SafeSignUpOutcome {
  // Do not serialize provider exceptions, credentials, or submitted fields.
  void operationError;
  return {
    status: "error",
    message:
      "We couldn’t complete sign-up right now. Check the configuration and try again.",
  };
}

export function getSafeSignOutFailureMessage() {
  return "We couldn’t confirm server-side sign-out. Local session cookies were cleared where possible, but the refresh token may remain usable and an access token may remain valid until it expires. Try again.";
}

export function getSafeRedirectPath(value: unknown) {
  const fallback = "/dashboard";

  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f]/.test(value)
  ) {
    return fallback;
  }
  if (/%(?![0-9a-f]{2})/i.test(value)) return fallback;

  const pathname = value.split(/[?#]/, 1)[0];
  if (/%(?:2f|5c)/i.test(pathname)) return fallback;

  try {
    const decodedPath = decodeURIComponent(pathname);
    if (
      decodedPath.startsWith("//") ||
      decodedPath.includes("\\") ||
      /[\u0000-\u001f]/.test(decodedPath)
    ) {
      return fallback;
    }

    const url = new URL(value, "https://campus.invalid");
    if (
      url.origin !== "https://campus.invalid" ||
      url.pathname.startsWith("//") ||
      url.pathname.includes("\\")
    ) {
      return fallback;
    }
    return `${url.pathname}${url.search}`;
  } catch {
    return fallback;
  }
}
