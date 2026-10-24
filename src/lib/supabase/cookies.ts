import {
  clearAuthCookiesAtScopes,
  type CookieOptions,
} from "@supabase/ssr";

type Cookie = { name: string; value: string };
type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export function getSupabaseAuthStorageKey(projectUrl: string) {
  const projectRef = new URL(projectUrl).hostname.split(".")[0];
  return `sb-${projectRef}-auth-token`;
}

/** Clear all auth-cookie chunks at the application's current host-only `/` scope. */
export async function clearSupabaseAuthCookies(input: {
  projectUrl: string;
  getAll: () => Cookie[] | Promise<Cookie[]>;
  setAll: (cookies: CookieToSet[]) => void | Promise<void>;
}) {
  await clearAuthCookiesAtScopes({
    getAll: input.getAll,
    setAll: async (cookies) => input.setAll(cookies),
    storageKey: getSupabaseAuthStorageKey(input.projectUrl),
    scopes: [{}],
  });
}
