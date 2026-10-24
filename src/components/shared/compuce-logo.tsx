type CompuceLogoProps = {
  compact?: boolean;
  light?: boolean;
};

export function CompuceLogo({ compact = false, light = false }: CompuceLogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`grid size-10 place-items-center rounded-[15px] ${light ? "bg-white/15 text-white" : "bg-violet text-white"}`}
      >
        <svg fill="none" height="22" viewBox="0 0 24 24" width="22">
          <path
            d="M12 20.2S3.8 15.4 3.8 9.2a4.3 4.3 0 0 1 8.2-1.8 4.3 4.3 0 0 1 8.2 1.8c0 6.2-8.2 11-8.2 11Z"
            fill="currentColor"
          />
          <path d="M7.4 12.1h3l1.1-2.2 2.2 4.2 1.2-2h2.1" stroke={light ? "#5b35a5" : "#fff"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
      </span>
      {!compact ? (
        <span className={`text-[21px] font-extrabold tracking-[-0.06em] ${light ? "text-white" : "text-foreground"}`}>
          compuce<span className={light ? "text-white/60" : "text-violet"}>.</span>
        </span>
      ) : null}
    </span>
  );
}
