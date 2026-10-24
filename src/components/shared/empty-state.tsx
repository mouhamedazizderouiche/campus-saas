import type { ReactNode } from "react";

export function EmptyState({
  symbol,
  title,
  description,
  action,
}: {
  symbol: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed border-[#dcd3e4] bg-white/75 px-6 py-10 text-center sm:min-h-[370px]">
      <span aria-hidden="true" className="grid size-16 place-items-center rounded-[22px] bg-violet-soft text-2xl text-violet">{symbol}</span>
      <h2 className="mt-5 text-xl font-extrabold tracking-[-0.04em]">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
