interface SectionTitleProps {
  children: React.ReactNode;
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-4 mt-10 mb-5">
      <h2 className="font-heading text-2xl tracking-[3px] text-[var(--brand-primary)] whitespace-nowrap">
        {children}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
    </div>
  );
}
