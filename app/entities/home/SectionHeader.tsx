import Link from 'next/link';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  action?: { href: string; label: string };
}

const SectionHeader = ({ eyebrow, title, action }: SectionHeaderProps) => (
  <div className="flex items-end justify-between gap-4 mb-8">
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">
        {title}
      </h2>
    </div>
    {action && (
      <Link
        href={action.href}
        className="shrink-0 text-sm font-medium text-fg-muted hover:text-accent transition-colors"
      >
        {action.label} →
      </Link>
    )}
  </div>
);

export default SectionHeader;
