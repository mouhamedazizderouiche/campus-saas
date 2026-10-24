export type MatchingIntention = "Dating" | "Friendship" | "Both";

export type DiscoveryProfile = {
  id: string;
  name: string;
  campus: string;
  biography: string;
  interests: string[];
  intention: MatchingIntention;
  illustration: string;
  demoLabel: "Fictional development fixture";
};
