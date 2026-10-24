import { Suspense } from "react";
import { AppShell, AppShellFallback } from "@/src/features/app-shell/app-shell";
import { DiscoveryExperience } from "@/src/features/discovery/discovery-experience";
import { getDevelopmentDiscoveryProfiles } from "@/src/features/discovery/dev-fixtures";

export default function DiscoverPage() {
  const profiles = getDevelopmentDiscoveryProfiles(process.env.NODE_ENV);

  return (
    <Suspense fallback={<AppShellFallback />}>
      <AppShell active="discover">
        <DiscoveryExperience profiles={profiles} />
      </AppShell>
    </Suspense>
  );
}
