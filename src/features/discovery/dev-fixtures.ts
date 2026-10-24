import type { DiscoveryProfile } from "@/src/features/discovery/types";

const fictionalDiscoveryProfiles: DiscoveryProfile[] = [
  {
    id: "fictional-sage",
    name: "Maya",
    campus: "Example campus · demo only",
    biography: "Usually looking for a new coffee spot, a long walk, or the perfect study-break playlist.",
    interests: ["Coffee walks", "Live music", "Bookshops"],
    intention: "Both",
    illustration: "/illustrations/portrait-sage.svg",
    demoLabel: "Fictional development fixture",
  },
  {
    id: "fictional-lilac",
    name: "Noah",
    campus: "Example campus · demo only",
    biography: "A weekend market person, amateur plant parent, and enthusiastic friend-of-friends.",
    interests: ["Markets", "Plants", "Cooking"],
    intention: "Friendship",
    illustration: "/illustrations/portrait-lilac.svg",
    demoLabel: "Fictional development fixture",
  },
  {
    id: "fictional-coral",
    name: "Ari",
    campus: "Example campus · demo only",
    biography: "Always up for a gallery afternoon, a spontaneous dessert run, or meeting someone new.",
    interests: ["Art", "Dessert", "City walks"],
    intention: "Dating",
    illustration: "/illustrations/portrait-coral.svg",
    demoLabel: "Fictional development fixture",
  },
];

/** Development-only fictional cards. Never return fixture profiles in production. */
export function getDevelopmentDiscoveryProfiles(environment: string) {
  return environment === "development" ? fictionalDiscoveryProfiles : [];
}
