import { Suspense } from "react";
import { AppShell, AppShellFallback } from "@/src/features/app-shell/app-shell";
import { PageHeading } from "@/src/components/shared/page-heading";

export default function MessagesPage() {
  return (
    <Suspense fallback={<AppShellFallback />}>
      <AppShell active="messages">
        <div className="space-y-7">
          <PageHeading
            description="A calm place for the conversation after the hello."
            eyebrow="Keep the good conversation going"
            title="Messages"
            action={<span className="w-fit rounded-full border border-[#eadff5] bg-white px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-violet">Visual prototype</span>}
          />

          <section aria-label="Messages prototype" className="grid min-h-[570px] overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_16px_50px_rgba(44,31,57,.055)] lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside aria-label="Conversation list" className="border-b border-line p-5 lg:border-b-0 lg:border-r lg:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold tracking-[-0.04em]">Conversations</h2>
                <span className="rounded-full bg-[#f6f3f7] px-2.5 py-1 text-[10px] font-bold text-muted">0 saved</span>
              </div>
              <div className="mt-5 flex min-h-28 items-center gap-3 rounded-2xl border border-dashed border-[#e2dbe5] bg-[#fcfbfc] p-4">
                <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-2xl bg-violet-soft text-lg text-violet">☏</span>
                <p className="text-xs leading-5 text-muted">Your real conversations will show up here after a verified match.</p>
              </div>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.1em] text-[#aaa2ad]">No real messages are available</p>
            </aside>

            <div className="flex min-h-[470px] flex-col p-4 sm:p-6">
              <div className="flex items-center gap-3 border-b border-line pb-4">
                <span aria-hidden="true" className="grid size-10 place-items-center rounded-2xl bg-[#f2ecfb] text-lg text-violet">✦</span>
                <div>
                  <h2 className="text-sm font-extrabold">Conversation layout preview</h2>
                  <p className="mt-0.5 text-[10px] font-semibold text-muted">No recipient · no messages sent</p>
                </div>
                <span className="ml-auto rounded-full bg-coral-soft px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#ad4e5d]">Prototype</span>
              </div>

              <div aria-label="Illustrative sample messages, not a real conversation" className="flex flex-1 flex-col justify-end gap-3 py-8">
                <p className="mx-auto mb-3 rounded-full bg-[#f6f3f7] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-muted">Visual sample · not saved</p>
                <div className="max-w-[84%] self-start rounded-2xl rounded-bl-md bg-[#f3eff5] px-4 py-3 text-sm leading-6 text-[#514958] sm:max-w-[70%]">Hey! I saw you are into coffee walks—have you found a favorite spot around campus?</div>
                <span className="ml-1 text-[9px] text-muted">Sample bubble</span>
                <div className="max-w-[84%] self-end rounded-2xl rounded-br-md bg-violet px-4 py-3 text-sm leading-6 text-white sm:max-w-[70%]">Not yet, but I am always up for a good recommendation ☕</div>
                <span className="mr-1 self-end text-[9px] text-muted">Sample bubble</span>
              </div>

              <form aria-label="Disabled message composer" className="flex gap-2 border-t border-line pt-4">
                <label className="sr-only" htmlFor="message-preview">Write a message</label>
                <input className="min-w-0 flex-1 rounded-2xl border border-line bg-[#fbfafb] px-4 py-3 text-sm text-muted placeholder:text-[#aaa2ad]" disabled id="message-preview" placeholder="Messaging is not connected yet" />
                <button aria-label="Send message unavailable" className="grid size-12 shrink-0 cursor-not-allowed place-items-center rounded-2xl bg-[#e8e3eb] text-[#928a97]" disabled type="button">
                  <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 20 20"><path d="m3 10 14-7-4 14-3.2-5.8L3 10Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" /><path d="m9.8 11.2 3.6-3.6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" /></svg>
                </button>
              </form>
              <p className="mt-3 text-center text-[10px] leading-4 text-muted">Messages cannot be sent or saved in this prototype.</p>
            </div>
          </section>
        </div>
      </AppShell>
    </Suspense>
  );
}
