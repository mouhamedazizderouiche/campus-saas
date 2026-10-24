export function InterestTag({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full border border-[#eee8f0] bg-[#fbf9fc] px-3 py-1.5 text-xs font-semibold text-[#655c6c]">
      {label}
    </span>
  );
}
