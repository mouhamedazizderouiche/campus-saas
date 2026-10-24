import type { ReactNode } from "react";

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.06em] text-foreground sm:text-[2.65rem]">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
