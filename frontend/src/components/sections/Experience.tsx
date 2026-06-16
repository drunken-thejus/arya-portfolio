"use client";

import type { Experience as ExperienceType } from "@/lib/types";
import { resolveImage } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import SectionHeading from "@/components/site/SectionHeading";

export default function Experience({ items }: { items: ExperienceType[] }) {
  return (
    <section id="experience" className="container-editorial scroll-mt-24 py-28 md:py-36">
      <SectionHeading label="Career" title="Where I've put words to work." />

      <div className="relative">
        <div className="absolute left-0 top-0 hidden h-full w-px bg-line md:block" />
        {items.map((exp, i) => {
          const logo = resolveImage(exp.logo);
          return (
            <Reveal key={exp.id} delay={i * 0.06}>
              <div className="group relative grid gap-4 border-b border-line py-10 md:grid-cols-12 md:pl-10">
                <span className="absolute left-[-4px] top-12 hidden h-2 w-2 rounded-full bg-line transition-colors group-hover:bg-accent md:block" />
                <div className="md:col-span-3">
                  <p className="font-mono text-sm text-bone-muted">
                    {exp.start_date}
                    {exp.end_date ? ` — ${exp.end_date}` : ""}
                  </p>
                </div>
                <div className="md:col-span-9">
                  <div className="flex items-center gap-3">
                    {logo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logo} alt={exp.company} className="h-8 w-8 rounded object-cover" />
                    )}
                    <h3 className="font-display text-2xl text-bone">{exp.role}</h3>
                  </div>
                  <p className="mt-1 text-accent">{exp.company}</p>
                  <p className="mt-3 max-w-2xl text-bone-muted">{exp.description}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
