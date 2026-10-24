"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { InterestTag } from "@/src/components/shared/interest-tag";

type ProfilePreview = {
  name: string;
  campus: string;
  bio: string;
  interests: string[];
  intention: "Dating" | "Friendship" | "Both";
};

const blankPreview: ProfilePreview = {
  name: "",
  campus: "",
  bio: "",
  interests: [],
  intention: "Both",
};

export function ProfileEditor() {
  const [preview, setPreview] = useState(blankPreview);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const photoUrlRef = useRef<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => () => {
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
  }, []);

  function setLocalPhoto(file: File | null) {
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    photoUrlRef.current = file ? URL.createObjectURL(file) : null;
    setPhotoUrl(photoUrlRef.current);
  }

  function updatePhoto(file: File | undefined) {
    setNotice("");
    setErrors((current) => current.filter((error) => !error.startsWith("Choose an image") && !error.startsWith("Photos must")));
    if (!file) {
      setLocalPhoto(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErrors((current) => [...current, "Choose an image file for the preview."]);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => [...current, "Photos must be 5 MB or smaller for this preview."]);
      return;
    }
    setLocalPhoto(file);
  }

  function submitPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("display-name") ?? "").trim();
    const campus = String(formData.get("campus") ?? "").trim();
    const bio = String(formData.get("bio") ?? "").trim();
    const interests = String(formData.get("interests") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 8);
    const intention = String(formData.get("intention") ?? "Both");
    const validationErrors: string[] = [];

    if (name.length < 2 || name.length > 40) validationErrors.push("Display name must be 2 to 40 characters.");
    if (campus.length > 80) validationErrors.push("Campus must be 80 characters or fewer.");
    if (bio.length > 240) validationErrors.push("Bio must be 240 characters or fewer.");
    if (!["Dating", "Friendship", "Both"].includes(intention)) validationErrors.push("Choose a matching intention.");

    setErrors(validationErrors);
    if (validationErrors.length) return;

    setPreview({
      name,
      campus,
      bio,
      interests,
      intention: intention as ProfilePreview["intention"],
    });
    setNotice("Preview updated in this page only. Nothing was saved or uploaded.");
  }

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(300px,.85fr)]">
      <section className="rounded-[26px] border border-line bg-white p-5 shadow-[0_12px_40px_rgba(44,31,57,.05)] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-violet-soft px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-violet">Local preview only</span>
            <h2 className="mt-3 text-xl font-extrabold tracking-[-0.045em]">A profile that feels like you</h2>
            <p className="mt-1 text-xs leading-5 text-muted">Try the fields and see a temporary preview. This is not connected to storage.</p>
          </div>
          <span aria-hidden="true" className="hidden size-11 place-items-center rounded-2xl bg-coral-soft text-xl text-coral sm:grid">✦</span>
        </div>

        {errors.length ? (
          <div aria-live="assertive" className="mt-5 rounded-2xl border border-[#f1c8cd] bg-coral-soft p-4 text-sm text-[#9f3e50]" role="alert">
            <p className="font-extrabold">A quick check</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-5">{errors.map((error) => <li key={error}>{error}</li>)}</ul>
          </div>
        ) : null}
        {notice ? <p aria-live="polite" className="mt-5 rounded-2xl border border-[#cfe5d6] bg-[#eef8f1] p-3 text-xs font-semibold text-[#32694a]" role="status">{notice}</p> : null}

        <form className="mt-6 space-y-5" onSubmit={submitPreview}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-extrabold" htmlFor="display-name">Display name <span className="text-coral">*</span></label>
              <input className="w-full rounded-xl border border-line bg-[#fcfbfc] px-3.5 py-3 text-sm outline-none transition placeholder:text-[#aaa2ad] focus:border-violet" id="display-name" maxLength={40} name="display-name" placeholder="What should people call you?" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-extrabold" htmlFor="campus">Campus <span className="font-medium text-muted">· optional</span></label>
              <input className="w-full rounded-xl border border-line bg-[#fcfbfc] px-3.5 py-3 text-sm outline-none transition placeholder:text-[#aaa2ad] focus:border-violet" id="campus" maxLength={80} name="campus" placeholder="Your campus or university" />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="text-xs font-extrabold" htmlFor="bio">A little about you</label>
              <span className="text-[10px] font-semibold text-muted">240 characters max</span>
            </div>
            <textarea className="min-h-28 w-full resize-y rounded-xl border border-line bg-[#fcfbfc] px-3.5 py-3 text-sm leading-6 outline-none transition placeholder:text-[#aaa2ad] focus:border-violet" id="bio" maxLength={240} name="bio" placeholder="The little things you love, what you are curious about…" />
          </div>

          <div>
            <label className="mb-2 block text-xs font-extrabold" htmlFor="interests">Interests <span className="font-medium text-muted">· separate with commas</span></label>
            <input className="w-full rounded-xl border border-line bg-[#fcfbfc] px-3.5 py-3 text-sm outline-none transition placeholder:text-[#aaa2ad] focus:border-violet" id="interests" name="interests" placeholder="Live music, walks, good food" />
            <p className="mt-1.5 text-[10px] text-muted">Up to 8 show in this preview.</p>
          </div>

          <fieldset>
            <legend className="mb-2.5 text-xs font-extrabold">I’m open to</legend>
            <div className="grid grid-cols-3 gap-2">
              {(["Dating", "Friendship", "Both"] as const).map((option) => (
                <label className="cursor-pointer" key={option}>
                  <input className="peer sr-only" defaultChecked={option === "Both"} name="intention" type="radio" value={option} />
                  <span className="flex min-h-11 items-center justify-center rounded-xl border border-line bg-white px-2 text-xs font-bold text-muted transition peer-checked:border-violet peer-checked:bg-violet-soft peer-checked:text-violet peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-violet">{option}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label className="mb-2 block text-xs font-extrabold" htmlFor="profile-photo">Profile photo <span className="font-medium text-muted">· local preview only</span></label>
            <input accept="image/*" className="block w-full rounded-xl border border-line bg-[#fcfbfc] px-3 py-2.5 text-xs text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-violet-soft file:px-3 file:py-2 file:text-xs file:font-bold file:text-violet" id="profile-photo" onChange={(event) => updatePhoto(event.currentTarget.files?.[0])} type="file" />
            <p className="mt-1.5 text-[10px] text-muted">Choose an image up to 5 MB. It stays in this browser tab and is never uploaded.</p>
          </div>

          <button className="w-full rounded-2xl bg-violet px-5 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-violet-dark" type="submit">Preview profile</button>
        </form>
      </section>

      <section aria-label="Temporary profile preview" className="overflow-hidden rounded-[26px] border border-line bg-white shadow-[0_12px_40px_rgba(44,31,57,.05)]">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="text-sm font-extrabold">Your preview</h2>
            <p className="mt-0.5 text-[10px] text-muted">Private to this page · not saved</p>
          </div>
          <span className="rounded-full bg-[#f6f3f7] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-muted">Prototype</span>
        </div>
        <div className="relative aspect-[1.15] min-h-[250px] overflow-hidden bg-violet-soft">
          {photoUrl ? (
            // This temporary object URL only previews a file selected in this browser.
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="Your selected local profile preview" className="h-full w-full object-cover" src={photoUrl} />
          ) : (
            <Image alt="Illustrated placeholder for your profile preview" className="object-cover" fill sizes="(max-width: 1280px) 100vw, 40vw" src="/illustrations/portrait-sage.svg" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#261d34]/80 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/90 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wide text-violet">Not a real profile</span>
          <div className="absolute inset-x-5 bottom-5 text-white">
            <span className="rounded-full bg-coral/95 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide">{preview.intention}</span>
            <h3 className="mt-3 text-3xl font-extrabold tracking-[-0.05em]">{preview.name || "Your name"}</h3>
            <p className="mt-1 text-xs text-white/80">{preview.campus || "Your campus goes here"}</p>
          </div>
        </div>
        <div className="space-y-4 p-5">
          <p className="min-h-12 text-sm leading-6 text-[#514958]">{preview.bio || "Your bio will help people get a feel for you."}</p>
          {preview.interests.length ? <div className="flex flex-wrap gap-2">{preview.interests.map((interest, index) => <InterestTag key={`${interest}-${index}`} label={interest} />)}</div> : <p className="text-xs text-muted">Your interests will appear here.</p>}
        </div>
      </section>
    </div>
  );
}
