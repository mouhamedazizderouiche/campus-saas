import { describe, expect, it } from "vitest";
import { getDevelopmentCampusContent } from "../../src/features/campus/dev-fixtures";

describe("development campus fixtures", () => {
  it("returns clearly fictional updates and future event samples only in development", () => {
    const now = new Date("2026-10-24T12:00:00.000Z");
    const content = getDevelopmentCampusContent("development", now);

    expect(content.posts.length).toBeGreaterThan(0);
    expect(content.events.length).toBeGreaterThan(0);
    expect(content.posts.every((post) => post.demoLabel === "Fictional sample · Example campus")).toBe(true);
    expect(content.events.every((event) => event.demoLabel === "Fictional sample · Example campus")).toBe(true);
    expect(content.events.every((event) => Date.parse(event.startsAt) > now.getTime())).toBe(true);
    expect(content.events.every((event) => event.location.includes("Demo") || event.location.includes("Example campus"))).toBe(true);
  });

  it("returns no sample campus content outside development", () => {
    expect(getDevelopmentCampusContent("production")).toEqual({ posts: [], events: [] });
    expect(getDevelopmentCampusContent("test")).toEqual({ posts: [], events: [] });
  });
});
