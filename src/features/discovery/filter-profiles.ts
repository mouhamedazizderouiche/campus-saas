import type { DiscoveryProfile, MatchingIntention } from "@/src/features/discovery/types";

export type IntentionFilter = "All" | MatchingIntention;

export function filterDiscoveryProfiles(
  profiles: DiscoveryProfile[],
  intention: IntentionFilter,
  interest: string | null,
) {
  return profiles.filter((profile) => {
    const matchesIntention = intention === "All" || profile.intention === intention;
    const matchesInterest = !interest || profile.interests.includes(interest);
    return matchesIntention && matchesInterest;
  });
}
