import { Suspense } from "react";
import { AppShell, AppShellFallback } from "@/src/features/app-shell/app-shell";
import { PageHeading } from "@/src/components/shared/page-heading";
import { ProfileEditor } from "@/src/features/profile-preview/profile-editor";

export default function ProfilePage() {
  return (
    <Suspense fallback={<AppShellFallback />}>
      <AppShell active="profile">
        <div className="space-y-7">
          <PageHeading
            description="Shape how you might show up in the Compuce community."
            eyebrow="A profile, in your own words"
            title="My profile"
            action={<span className="w-fit rounded-full border border-[#eadff5] bg-white px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-violet">Preview only · not saved</span>}
          />
          <ProfileEditor />
          <p className="mx-auto max-w-3xl text-center text-xs leading-5 text-muted">Profile data and photo storage are not implemented. This preview clears when you leave or refresh the page; it does not update your account.</p>
        </div>
      </AppShell>
    </Suspense>
  );
}
