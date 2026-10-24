export type CampusPostFixture = {
  id: string;
  author: string;
  createdAt: string;
  content: string;
  category: string;
  demoLabel: "Fictional sample · Example campus";
};

export type CampusEventFixture = {
  id: string;
  title: string;
  startsAt: string;
  location: string;
  organizer: string;
  category: string;
  description: string;
  demoLabel: "Fictional sample · Example campus";
};

export type CampusContentFixtures = {
  posts: CampusPostFixture[];
  events: CampusEventFixture[];
};

const demoLabel = "Fictional sample · Example campus" as const;

/** Clearly fictional content for development UI only; production receives no fixtures. */
export function getDevelopmentCampusContent(
  environment: string,
  now = new Date(),
): CampusContentFixtures {
  if (environment !== "development") return { posts: [], events: [] };

  const hoursFromNow = (hours: number) =>
    new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();

  return {
    posts: [
      {
        id: "demo-post-study-table",
        author: "Mina R.",
        createdAt: hoursFromNow(-2),
        content: "Found a quiet corner for a study break and a very good playlist. What are you listening to this week?",
        category: "Campus life",
        demoLabel,
      },
      {
        id: "demo-post-club-ideas",
        author: "Sam K.",
        createdAt: hoursFromNow(-21),
        content: "What kind of low-key meetups would you like to see around campus? Sharing ideas is welcome here.",
        category: "Community prompt",
        demoLabel,
      },
    ],
    events: [
      {
        id: "demo-event-creative-hour",
        title: "Creative hour",
        startsAt: hoursFromNow(30),
        location: "Demo location · Example campus",
        organizer: "Fictional student group",
        category: "Make & create",
        description: "A relaxed, fictional drop-in to sketch, journal, or work on a small creative project. This sample is not a real campus event.",
        demoLabel,
      },
      {
        id: "demo-event-walk-break",
        title: "A walk between classes",
        startsAt: hoursFromNow(74),
        location: "Demo meeting point · Example campus",
        organizer: "Fictional student group",
        category: "Get together",
        description: "An illustrative example of an informal campus activity. This sample is not a real campus event.",
        demoLabel,
      },
    ],
  };
}
