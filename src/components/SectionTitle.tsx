interface SectionTitleProps {
  children: React.ReactNode;
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2.5 md:gap-4 mt-7 mb-4 md:mt-10 md:mb-5">
      <h2 className="font-heading text-xl md:text-2xl tracking-[3px] text-[var(--brand-primary)] whitespace-nowrap">
        {children}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
    </div>
  );
}
