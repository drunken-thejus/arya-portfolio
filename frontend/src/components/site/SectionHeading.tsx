import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  label,
  title,
  className,
}: {
  label: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-14 max-w-3xl", className)}>
      <Reveal>
        <p className="label-mono mb-5 flex items-center gap-3">
          <span className="inline-block h-px w-8 bg-bone-faint" />
          {label}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-display text-heading text-bone">{title}</h2>
      </Reveal>
    </div>
  );
}
