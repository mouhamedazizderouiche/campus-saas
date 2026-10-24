import { describe, expect, it } from "vitest";
import { getDevelopmentDiscoveryProfiles } from "../../src/features/discovery/dev-fixtures";
import { filterDiscoveryProfiles } from "../../src/features/discovery/filter-profiles";

describe("development discovery fixtures", () => {
  it("returns only explicitly fictional profiles in development", () => {
    const profiles = getDevelopmentDiscoveryProfiles("development");

    expect(profiles.length).toBeGreaterThan(0);
    expect(profiles.every((profile) => profile.demoLabel === "Fictional development fixture")).toBe(true);
    expect(profiles.every((profile) => profile.campus.includes("demo only"))).toBe(true);
  });

  it("never returns fixture profiles in production or test environments", () => {
    expect(getDevelopmentDiscoveryProfiles("production")).toEqual([]);
    expect(getDevelopmentDiscoveryProfiles("test")).toEqual([]);
  });
});

describe("discovery filters", () => {
  it("filters fictional profiles by intention and interest", () => {
    const profiles = getDevelopmentDiscoveryProfiles("development");

    expect(filterDiscoveryProfiles(profiles, "Friendship", null).map((profile) => profile.name)).toEqual(["Noah"]);
    expect(filterDiscoveryProfiles(profiles, "All", "Art").map((profile) => profile.name)).toEqual(["Ari"]);
    expect(filterDiscoveryProfiles(profiles, "Dating", "Cooking")).toEqual([]);
  });
});
